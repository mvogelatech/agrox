import { GeoJSONObject } from '@turf/helpers';
declare type Coordinate = [number, number];
interface IFieldFeature {
    type: 'Feature';
    geometry: {
        type: 'Polygon';
        coordinates: Coordinate[];
    };
    properties: {
        field: number;
        area: number;
        farm: number;
    };
}
export interface IFieldFeatureCollection {
    farm: number;
    area: number;
    type: 'FeatureCollection';
    features: IFieldFeature[];
}
export declare class FieldMapService {
    private readonly logger;
    insertFieldData(geojson: GeoJSONObject): Promise<IFieldFeatureCollection>;
}
export {};
