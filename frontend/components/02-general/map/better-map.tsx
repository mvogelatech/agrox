import React, { useRef, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Region, MapViewDimensions } from './map-utils';

type MapViewRef = MapView & {
	isReady: boolean;
	lastKnownDimensions: MapViewDimensions;
};

type FunctionFromTypes<ThisType, ArgumentsType extends unknown[], ReturnType> = (this: ThisType, ...args: ArgumentsType) => ReturnType;

function requireNonemptyArrayAsFirstArg<T, A extends unknown[], R>(f: FunctionFromTypes<T, A, R>, name: string): FunctionFromTypes<T, A, R> {
	return function (this: T, ...args: A) {
		if (args.length === 0 || !Array.isArray(args[0]) || args[0].length === 0) {
			throw new Error(`Expected first argument of '${name}' to be a nonempty array, got ${args[0] ? JSON.stringify(args[0]) : typeof args[0]}.`);
		}

		return f.apply(this, args);
	};
}

const alreadyPatchedMaps = new Set<MapView>();

function monkeyPatchMapViewMethods(map: MapView): MapView {
	if (alreadyPatchedMaps.has(map)) return map;
	alreadyPatchedMaps.add(map);

	const originalFitToSuppliedMarkers = map.fitToSuppliedMarkers.bind(map);
	const originalFitToCoordinates = map.fitToCoordinates.bind(map);
	map.fitToSuppliedMarkers = requireNonemptyArrayAsFirstArg(originalFitToSuppliedMarkers, 'fitToSuppliedMarkers');
	map.fitToCoordinates = requireNonemptyArrayAsFirstArg(originalFitToCoordinates, 'fitToCoordinates');
	return map;
}

function prepareToCallback(map: MapViewRef): [MapView, MapViewDimensions] {
	const patchedMap = monkeyPatchMapViewMethods(map);
	const dim = { ...map.lastKnownDimensions };
	return [patchedMap, dim];
}

type BetterMapProps = {
	children?: React.ReactNode;
	isScrollEnabled: boolean;
	isZoomEnabled: boolean;
	initialRegion?: Region;
	onRender?: (map: MapView, dimensions: MapViewDimensions) => void;
	onResize?: (map: MapView, newDimensions: MapViewDimensions) => void;
	onPress?: (map: MapView, dimensions: MapViewDimensions) => void;
	onRegionChangeComplete?: (map: MapView, dimensions: MapViewDimensions) => void;
};

export function BetterMap(props: BetterMapProps) {
	// const rerenderStartTime = new Date().getTime();
	// const elapsed = () => new Date().getTime() - rerenderStartTime;

	const mapRef = useRef<MapViewRef>(null);

	function callOnRender() {
		if (!props.onRender) return;
		// console.log(`Info: BetterMap#onRender() being called ${elapsed()}ms after rerendering began.`);
		props.onRender(...prepareToCallback(mapRef.current!));
	}

	useEffect(() => {
		// `useEffect` executes before `onMapReady` which in turn executes before `onLayout`.
		if (mapRef.current?.isReady) {
			callOnRender();
		}
	});

	let mapJustGotReady = false;

	return (
		<MapView
			ref={mapRef}
			collapsable={false}
			provider={PROVIDER_GOOGLE}
			mapType="satellite"
			style={{ flex: 1 }}
			initialRegion={props.initialRegion}
			pitchEnabled={false}
			rotateEnabled={false}
			toolbarEnabled={false}
			scrollEnabled={props.isScrollEnabled}
			zoomEnabled={props.isZoomEnabled}
			onPress={() => props.onPress?.(...prepareToCallback(mapRef.current!))}
			onRegionChangeComplete={() => props.onRegionChangeComplete?.(...prepareToCallback(mapRef.current!))}
			onMapReady={() => {
				mapRef.current!.isReady = true;
				mapJustGotReady = true;
			}}
			onLayout={({ nativeEvent }) => {
				mapRef.current!.lastKnownDimensions = {
					widthPx: nativeEvent.layout.width,
					heightPx: nativeEvent.layout.height,
				};

				if (mapJustGotReady) {
					callOnRender();
				} else {
					props.onResize?.(...prepareToCallback(mapRef.current!));
				}
			}}
		>
			{props.children}
		</MapView>
	);
}
