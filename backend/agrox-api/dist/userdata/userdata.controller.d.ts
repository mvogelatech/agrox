/// <reference types="node" />
import { Response } from 'express';
import { UserDataService } from './userdata.service';
export declare class UserDataController {
    readonly userDataService: UserDataService;
    constructor(userDataService: UserDataService);
    getFarmDataByUserId(user_id: string): Promise<string>;
    getUnreadNotificationsCount(user_id: string): Promise<string>;
    uploadUserAvatar(user_id: string, image: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
    }): void;
    downloadUserAvatar(user_id: string, res: Response): Promise<void>;
}
