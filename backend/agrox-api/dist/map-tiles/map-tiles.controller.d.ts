import { Response } from 'express';
import { MapTilesService } from './map-tiles.service';
export declare class MapTilesController {
    private readonly mapTilesService;
    constructor(mapTilesService: MapTilesService);
    getTile(farmid: string, date: string, z: string, x: string, y: string, token: string, res: Response): Promise<void>;
}
