export declare class UserDataService {
    getFarmDataByUserId(userId: number): Promise<{
        password: string;
        id: number;
        first_name: string;
        last_name: string;
        username: string;
        phone_number: string;
        email: string | null;
        active: boolean;
        creation_date: Date;
        access_date: Date;
        update_date: Date;
        yellow_threshold: number;
        red_threshold: number;
        fcm_token: string | null;
        user_accepted_terms: import(".prisma/client").user_accepted_terms[];
        user_accepted_privacy_policy: import(".prisma/client").user_accepted_privacy_policy[];
        user_role: (import(".prisma/client").user_role & {
            role: import(".prisma/client").role;
        })[];
        notification: import(".prisma/client").notification[];
        many_user_has_many_farm: (import(".prisma/client").many_user_has_many_farm & {
            farm: import(".prisma/client").farm & {
                imaging: import(".prisma/client").imaging[];
                address: import(".prisma/client").address & {
                    state: import(".prisma/client").state;
                };
                area: (import(".prisma/client").area & {
                    field: (import(".prisma/client").field & {
                        crop: (import(".prisma/client").crop & {
                            diagnosis: (import(".prisma/client").diagnosis & {
                                prescription: import(".prisma/client").prescription[];
                                infestation: {
                                    id: number;
                                    plague: import(".prisma/client").plague;
                                    area_ha: number;
                                }[];
                            })[];
                        })[];
                    })[];
                })[];
            };
        })[];
    } | null>;
    setUserAvatar(userId: number, image: string): Promise<import(".prisma/client").user>;
    getUserAvatar(userId: number): Promise<string>;
    getUnreadNotificationsCount(userId: number): Promise<number>;
}
