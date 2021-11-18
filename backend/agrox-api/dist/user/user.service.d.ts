export declare class UserService {
    findUnique(username: string, password: string): Promise<import(".prisma/client").user[] | undefined>;
}
