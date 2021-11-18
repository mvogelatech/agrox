import React, { useEffect, useMemo, useState } from 'react';
import MapView, { Marker, Polygon, Overlay, LatLng, UrlTile } from 'react-native-maps';
import { Text, View } from 'react-native';
import { dispatch, useMainSelector } from '../../../redux-things';
import { AutoRefreshableMap } from './auto-refreshable-map';
import { useStatesChanged } from '../../../src/custom-hooks/use-states-changed';
import { Index, Models } from '../../../models';
import { MapPin } from './map-pin';
import { getMapPinColorDate, useThresholds } from '../../../src/utils/semaphore';
import * as MapUtils from './map-utils';
import { getIndexImageLocalUri, isIndexAvailable } from '../../../src/utils/visiona-indices';
import { formatDate, getAreaLatestDiagnosis, getLatestDiagnosis, REM_SCALE } from '../../../src/utils';
import { BACKEND_BASE_URL } from '../../../src/network';
import * as FileSystem from 'expo-file-system';
import { alertDatePrescription, displayAlert } from '../../../src/utils/alert-messages';
import { colors, images } from '../../../src/assets';
import * as Location from 'expo-location';

const BASE_64_VALIDATION_TOKEN = 'WDl5NDhVV2ZlRTAsSlo3JWJYfUdJe3ZvLlsmayFILWs4XXVldDg7WA==';

function logCurrentCamera(map: MapView, dimensions: MapUtils.MapViewDimensions): void {
	void (async () => {
		const camera = await map.getCamera();
		console.log(`Current map dimensions are ${dimensions.widthPx}x${dimensions.heightPx} and current camera is:`, camera);
	})();
}

function fieldToLatLng(field: Models.field): MapUtils.LatLng {
	return {
		latitude: field.lat,
		longitude: field.long,
	};
}

function padToPins(box: MapUtils.BoundingBox, pins: MapUtils.LatLng[]): MapUtils.BoundingBox {
	return MapUtils.addRoughPaddingToBoundingBox(
		MapUtils.addEnoughPaddingToEnsurePinsVisible(
			box,
			pins.map((p) => MapUtils.geoToWorldCoords(p)),
		),
		{ bottom: 10, left: 0, right: 0, top: 10 },
	);
}

function fieldGeoToWorldCoords(field: Models.field): MapUtils.WorldCoordinate[] {
	const coords: MapUtils.WorldCoordinate[] = [];
	for (const [longitude, latitude] of field.coordinates) {
		coords.push(MapUtils.geoToWorldCoords({ latitude, longitude }));
	}

	return coords;
}

function getPlaceToShow(area: Models.area, field: Models.field | undefined, fieldPins: MapUtils.LatLng[]): MapUtils.BoundingBox | MapUtils.SimpleCamera {
	if (field) {
		const fieldWorldCoords = fieldGeoToWorldCoords(field);

		if (fieldWorldCoords.length < 3) {
			return {
				center: { latitude: field.lat, longitude: field.long },
				zoom: 17,
			};
		}

		return padToPins(MapUtils.getBoundingBox(fieldWorldCoords), [fieldToLatLng(field)]);
	}

	// calculate the bounding box for the whole area
	let areaWorldCoords: MapUtils.WorldCoordinate[] = [];
	for (const field of area.field) {
		areaWorldCoords = areaWorldCoords.concat(fieldGeoToWorldCoords(field));
	}

	if (areaWorldCoords.length < 3) {
		console.warn(`This area has only ${areaWorldCoords.length} points? How is this possible? Let's show the center of the world`);
		return [
			{ x: 256 / 4, y: 256 / 4 },
			{ x: (256 / 4) * 3, y: (256 / 4) * 3 },
		];
	}

	return padToPins(MapUtils.getBoundingBox(areaWorldCoords), fieldPins);
}

function getDiagnosisOverlays(field: Models.field | undefined, area: Models.area) {
	const fields = field ? [field] : area.field;
	const imageOverlayCallBack = (field: Models.field) => {
		// for now we're displaying only the most recent diagnosis
		const diagnosis = getLatestDiagnosis(field);
		return diagnosis ? (
			<Overlay
				key={`${new Date().getTime()}_${field.id}_${diagnosis.id}_IndexOverlay`}
				bounds={MapUtils.overlayBounding(field.coordinates)}
				// https://github.com/react-native-maps/react-native-maps/pull/3018
				// this is a kludge !!!! the correct way to use this is to send the bearer token in a header
				// but the this Overlay component is not working, so for now we pass the validation pipe token in the uri
				// check the backend also fo the same TODO message. the validation token is encoded in base64
				image={{
					uri: `${BACKEND_BASE_URL}/diagnosis/${field.id}/${diagnosis.id}/${BASE_64_VALIDATION_TOKEN}`,
					cache: 'reload',
				}}
			/>
		) : undefined;
	};

	// images to be overlayed on top of the map
	return fields.map((field) => imageOverlayCallBack(field));
}

function getDiagnosisDateMarkers(field: Models.field | undefined, area: Models.area) {
	const areaOverlayBound = (area: Models.area) => {
		let coords: Array<[number, number]> = [];
		for (const field of area.field) {
			coords = coords.concat(field.coordinates);
		}

		return MapUtils.lowerCenter(coords);
	};

	const reportDate = field ? getLatestDiagnosis(field)?.report_date : getAreaLatestDiagnosis(area)?.report_date;
	// markers with date of the image to be displayed on top of the field
	const markers = field ? (
		<Marker key={`${field.id}_IndexDate`} coordinate={MapUtils.lowerCenter(field.coordinates)} title={reportDate}>
			<View style={{ backgroundColor: 'white', padding: 0 }}>
				<Text>{reportDate ? formatDate(reportDate) : 'N/D'}</Text>
			</View>
		</Marker>
	) : area ? (
		<Marker key={`${area.id}_IndexDate`} coordinate={areaOverlayBound(area)} title={reportDate}>
			<View style={{ backgroundColor: 'white', padding: 0 }}>
				<Text>{reportDate ? formatDate(reportDate) : 'N/D'}</Text>
			</View>
		</Marker>
	) : undefined;

	return markers;
}

async function getIndicesOverlay(field: Models.field | undefined, area: Models.area, indexTab: Index, indexDate: string | undefined) {
	const fields = field
		? [field]
		: area.field.filter((field) => {
				return isIndexAvailable(field);
		  });
	const elements = [];

	for (const field of fields) {
		const imgUri = getIndexImageLocalUri(field, indexTab.name, indexDate!);
		// console.log('link', imgUri);
		if (imgUri) {
			const { exists } = await FileSystem.getInfoAsync(imgUri);
			if (exists) {
				elements.push(
					<Overlay
						key={`${field.id}_IndexOverlay`}
						bounds={MapUtils.overlayBounding(field.coordinates)}
						image={{
							uri: imgUri,
							cache: 'reload',
						}}
					/>,
				);
			} else {
				elements.push(
					<Marker key={`${field.id}_IndexOverlay`} coordinate={MapUtils.center(field.coordinates)}>
						<View style={{ backgroundColor: 'white', padding: 0 }}>
							<Text>Imagem não disponível</Text>
						</View>
					</Marker>,
				);
			}
		}
	}

	return elements;
}

async function getIndicesMarkers(field: Models.field | undefined, area: Models.area, indexTab: Index, indexDate: string | undefined) {
	const areaOverlayBound = (area: Models.area) => {
		let coords: Array<[number, number]> = [];

		for (const field of area.field) {
			coords = coords.concat(field.coordinates);
		}

		return MapUtils.lowerCenter(coords);
	};

	// markers with date of the image to be displayed on top of the field
	const markers =
		field && indexDate ? (
			<Marker key={`${field.id}_IndexDate`} coordinate={MapUtils.lowerCenter(field.coordinates)} title={indexDate}>
				<View style={{ backgroundColor: 'white', padding: 0 }}>
					<Text>{indexDate ? formatDate(indexDate) : 'N/D'}</Text>
				</View>
			</Marker>
		) : area ? (
			<Marker key={`${area.id}_IndexDate`} coordinate={areaOverlayBound(area)} title={indexDate}>
				<View style={{ backgroundColor: 'white', padding: 0 }}>
					<Text>{indexDate ? formatDate(indexDate) : 'N/D'}</Text>
				</View>
			</Marker>
		) : undefined;

	return markers;
}

export function Map() {
	const area = useMainSelector((state) => state.interactionData.general.currentArea)!;
	const field = useMainSelector((state) => state.interactionData.general.currentField);
	const farm = useMainSelector((state) => state.backendData.user!.many_user_has_many_farm[0].farm)!;
	const tab = useMainSelector((state) => state.interactionData.general.currentTab);
	const indexTab = useMainSelector((state) => state.interactionData.general.indicesCurrentTab);
	const indexDate = useMainSelector((state) => state.interactionData.general.indicesCurrentDate);
	const semaphoreThresholds = useThresholds();

	const [indicesOverlays, setIndicesOverlay] = useState(new Array<JSX.Element>());
	const [indicesMarkers, setIndicesMarkers] = useState({});

	// const [location, setLocation] = useState(null);
	// const [errorMsg, setErrorMsg] = useState(null);

	// useEffect(() => {
	// 	(async () => {
	// 		let { status } = await Location.requestPermissionsAsync();
	// 		console.log('status', status);
	// 		if (status !== 'granted') {
	// 			setErrorMsg('Permission to access location was denied');
	// 			return;
	// 		}

	// 		await Location.watchPositionAsync({ distanceInterval: 1, accuracy: Location.Accuracy.High }, (loc) => {
	// 			setLocation(loc);
	// 		});
	// 	})();
	// }, []);

	// let coords: MapUtils.LatLng;
	// if (location) {
	// 	// 	coords = coords.concat([location.coords.latitude, location.coords.longitude]);
	// 	// 	console.log('location', coords);
	// 	// }
	// 	coords = {
	// 		latitude: location.coords.latitude ? location.coords.latitude : 0,
	// 		longitude: location.coords.longitude ? location.coords.longitude : 0,
	// 	};
	// }
	// setup vegetation indices maps from visiona api
	useEffect(() => {
		(async () => {
			const overlays = await getIndicesOverlay(field, area, indexTab, indexDate);
			if (overlays) setIndicesOverlay(overlays);

			const markers = await getIndicesMarkers(field, area, indexTab, indexDate);
			if (markers) setIndicesMarkers(markers);
		})();
	}, [field, area, indexTab, indexDate]);

	// To improve performance, `useMemo` lets us recalculate the markers only when the area/tab changes.
	const [fieldPins, fieldPinMarkers, borders] = useMemo(() => {
		const points = area.field.map((field) => ({
			latitude: field.lat,
			longitude: field.long,
		}));

		const markers = area.field.map((field) => (
			<Marker
				key={`${field.id}_FieldPin`}
				coordinate={fieldToLatLng(field)}
				title={field.name}
				onPress={() => {
					if (field.crop[0].diagnosis[0]) {
						// displayAlert(alertDatePrescription);
						dispatch({ type: 'CHANGE_FIELD', field });
						dispatch({ type: 'CHANGE_GENERAL_CARD', card: 'Profile' });
					} else {
						dispatch({ type: 'CHANGE_FIELD', field });
						dispatch({ type: 'CHANGE_GENERAL_CARD', card: 'Profile' });
					}
				}}
			>
				<MapPin id={field.code} pinColor={getMapPinColorDate(field)} />
			</Marker>
		));

		const borders = area.field.map((field) => (
			<Polygon
				key={`${field.id}_FieldPin`}
				coordinates={field.coordinates.map((item) => ({ longitude: item[0], latitude: item[1] }))}
				strokeColor="white"
				strokeWidth={Number(REM_SCALE)}
				zIndex={10}
				fillColor="rgba(255, 0, 0, 0)"
			/>
		));

		return [points, markers, borders];
	}, [area, tab, semaphoreThresholds]);

	// To improve performance, `useMemo` lets us recalculate the place only when the involved things change.
	const placeToShow = useMemo(() => {
		return getPlaceToShow(area, field, fieldPins);
	}, [area, field, fieldPins]);

	const mustUpdateCamera = useStatesChanged([area, field]);

	return (
		<AutoRefreshableMap
			isScrollEnabled={field !== undefined || area !== undefined}
			isZoomEnabled={field !== undefined || area !== undefined}
			place={placeToShow}
			shouldRefresh={() => mustUpdateCamera}
			onPress={logCurrentCamera}
		>
			<UrlTile
				flipY
				urlTemplate={`${BACKEND_BASE_URL}/map-tiles/${area.farm_id}/${farm.imaging[0]?.directory ?? ''}/{z}/{x}/{y}/${BASE_64_VALIDATION_TOKEN}`}
				zIndex={-1} /* an absurd low z index to make sure this layer is below all others */
			/>

			{/* <Marker key={`_FieldPin`} coordinate={coords} title={'ponto'}>
				<MapPin id={10} pinColor={colors.flags.red} />
			</Marker> */}

			{/* <Marker key={`.`} coordinate={MapUtils.lowerCenter(coords)} title={'teste'}> */}
			{/* <View style={{ backgroundColor: 'white', padding: 0 }}> */}
			{/* <Text>{indexDate ? formatDate(indexDate) : 'N/D'}</Text> */}
			{/* </View> */}
			{/* <MapPin id={10} pinColor={colors.flags.red} /> */}
			{/* </Marker> */}

			{fieldPinMarkers}
			{tab !== 'Diagnosis' && borders}
			{tab === 'Indices' && indexDate && indicesOverlays}
			{tab === 'Indices' && indexDate && indicesMarkers}
			{tab === 'Diagnosis' && getDiagnosisOverlays(field, area)}
			{tab === 'Diagnosis' && getDiagnosisDateMarkers(field, area)}
			{tab === 'Overview' && borders}
		</AutoRefreshableMap>
	);
}
