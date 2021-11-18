import { GeoJSONObject } from '@turf/helpers';
import { FieldMapService, IFieldFeatureCollection } from './field-map.service';
export declare class FieldMapDTO {
    accessToken: string;
    geojsonData: GeoJSONObject;
}
export declare class FieldMapController {
    private readonly fieldMapService;
    constructor(fieldMapService: FieldMapService);
    createUpdateFieldMap(data: FieldMapDTO): Promise<IFieldFeatureCollection>;
}
