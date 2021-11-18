import { HttpService } from '@nestjs/common';
declare type VisionaObservation = {
    id: string;
    date: string;
    stats: {
        pixel?: {
            total?: number;
            valid?: number;
            cloud?: number;
            shadow?: number;
            nodata?: number;
        };
        indice: {
            savi?: {
                browseUrl: string;
            };
            ndwi?: {
                browseUrl: string;
            };
            ndvi?: {
                browseUrl: string;
            };
            ndre?: {
                browseUrl: string;
            };
            land_cover?: {
                browseUrl: string;
            };
            greenness?: {
                browseUrl: string;
            };
            fcover?: {
                browseUrl: string;
            };
            true_color?: {
                browseUrl: string;
            };
            false_color?: {
                browseUrl: string;
            };
        };
    };
};
export declare class VisionaService {
    private readonly httpService;
    private readonly logger;
    constructor(httpService: HttpService);
    listArea(fieldId?: number): Promise<VisionaObservation[]>;
    createArea(fieldId: number): Promise<any>;
    createAreas(farmId: number): Promise<void>;
    deleteArea(fieldId: number): Promise<any>;
    deleteAreas(farmId: number): Promise<void>;
    listObservations(fieldId?: number): Promise<any>;
}
export {};
