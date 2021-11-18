import { PlagueService } from './plague.service';
export declare class PlagueController {
    readonly plagueService: PlagueService;
    constructor(plagueService: PlagueService);
    getPlagues(): Promise<string>;
}
