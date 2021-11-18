import React from 'react';
import MapView from 'react-native-maps';
import { BetterMap } from './better-map';
import * as MapUtils from './map-utils';

type AutoRefreshableMapProps = {
	children?: React.ReactNode;
	isScrollEnabled: boolean;
	isZoomEnabled: boolean;
	place: MapUtils.BoundingBox | MapUtils.Region | MapUtils.SimpleCamera;
	shouldRefresh: (info: { isResize: boolean; dimensions: MapUtils.MapViewDimensions }) => boolean;
	onPress?: (map: MapView, dimensions: MapUtils.MapViewDimensions) => void;
	onRegionChangeComplete?: (map: MapView, dimensions: MapUtils.MapViewDimensions) => void;
};

export function AutoRefreshableMap(props: AutoRefreshableMapProps) {
	const place = Array.isArray(props.place) ? MapUtils.boundingBoxToRegion(props.place) : props.place;

	function refresh(map: MapView, dimensions: MapUtils.MapViewDimensions, isResize: boolean) {
		// const camera = Array.isArray(props.place)
		// 	? MapUtils.boundingBoxToCamera(props.place, dimensions, 20)
		// 	: 'zoom' in props.place
		// 	? props.place
		// 	: undefined;

		// if (camera) {
		// 	setTimeout(() => {
		// 		const tiles = MapUtils.cameraToTiles(camera.center, camera.zoom, dimensions);
		// 		console.log(
		// 			'Predicted tiles!',
		// 			tiles.map((tile) => `${camera.zoom}/${tile.tileX}/${tile.tileY}`),
		// 		);
		// 	}, 1);
		// }

		if (props.shouldRefresh({ isResize, dimensions })) {
			if ('zoom' in place) {
				map.animateCamera({ pitch: 0, heading: 0, altitude: 0, ...place }, { duration: 800 });
			} else {
				map.animateToRegion(place, 800);
			}
		}
	}

	return (
		<BetterMap
			isScrollEnabled={props.isScrollEnabled}
			isZoomEnabled={props.isZoomEnabled}
			initialRegion={'zoom' in place ? undefined : place}
			onRender={(map, dimensions) => refresh(map, dimensions, false)}
			onResize={(map, dimensions) => refresh(map, dimensions, true)}
			onPress={props.onPress}
			onRegionChangeComplete={props.onRegionChangeComplete}
		>
			{props.children}
		</BetterMap>
	);
}
