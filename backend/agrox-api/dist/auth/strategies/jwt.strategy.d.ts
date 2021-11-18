import { Strategy } from 'passport-jwt';
declare type PayLoad = {
    username: string;
    sub: number;
    iat: number;
    exp: number;
};
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: PayLoad): Promise<{
        userId: number;
        username: string;
    }>;
}
export {};
