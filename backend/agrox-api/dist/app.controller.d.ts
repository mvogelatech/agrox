/// <reference types="passport" />
import { AuthService } from './auth/auth.service';
import { AgroRequest } from './types';
export declare class AppController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: AgroRequest): Promise<{
        access_token: string;
    }>;
    getProfile(req: AgroRequest): Promise<Express.User & {
        userId: number | undefined;
    }>;
}
