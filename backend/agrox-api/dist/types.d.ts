import type { Request } from 'express';
export declare type AgroRequest = Request & {
    user: {
        userId: number | undefined;
    };
};
