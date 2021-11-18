import { VisionaService } from './visiona.service';
export declare class VisionaDTO {
    accessToken: string;
    id: number;
}
export declare class ImageDTO {
    accessToken: string;
    url: string;
}
export declare class VisionaController {
    private readonly visionaService;
    constructor(visionaService: VisionaService);
    listArea(data: VisionaDTO): Promise<{
        id: string;
        date: string;
        stats: {
            pixel?: {
                total?: number | undefined;
                valid?: number | undefined;
                cloud?: number | undefined;
                shadow?: number | undefined;
                nodata?: number | undefined;
            } | undefined;
            indice: {
                savi?: {
                    browseUrl: string;
                } | undefined;
                ndwi?: {
                    browseUrl: string;
                } | undefined;
                ndvi?: {
                    browseUrl: string;
                } | undefined;
                ndre?: {
                    browseUrl: string;
                } | undefined;
                land_cover?: {
                    browseUrl: string;
                } | undefined;
                greenness?: {
                    browseUrl: string;
                } | undefined;
                fcover?: {
                    browseUrl: string;
                } | undefined;
                true_color?: {
                    browseUrl: string;
                } | undefined;
                false_color?: {
                    browseUrl: string;
                } | undefined;
            };
        };
    }[]>;
    createArea(data: VisionaDTO): Promise<any>;
    createAreas(data: VisionaDTO): Promise<void>;
    deleteArea(data: VisionaDTO): Promise<any>;
    deleteAreas(data: VisionaDTO): Promise<void>;
    listObservations(data: VisionaDTO): Promise<any>;
}
