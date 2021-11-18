/// <reference types="node" />
export declare class MapTilesService {
    private readonly logger;
    private readonly storage;
    tileUrl(farmid: string, date: string, z: string, x: string, y: string): Promise<Buffer | null>;
}
