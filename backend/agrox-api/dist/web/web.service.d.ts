export declare class WebService {
    getFarmDataByUserId(userId: number): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        username: string;
        password: string;
        phone_number: string;
        email: string | null;
        active: boolean;
        creation_date: Date;
        access_date: Date;
        update_date: Date;
        yellow_threshold: number;
        red_threshold: number;
        fcm_token: string | null;
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
        notification: import(".prisma/client").notification[];
        user_accepted_privacy_policy: import(".prisma/client").user_accepted_privacy_policy[];
        user_accepted_terms: import(".prisma/client").user_accepted_terms[];
        user_role: (import(".prisma/client").user_role & {
            role: import(".prisma/client").role;
        })[];
    }[]>;
    getRequests(): Promise<{
        many_user_has_many_farm: (import(".prisma/client").many_user_has_many_farm & {
            farm: import(".prisma/client").farm & {
                area: {
                    id: number;
                    name: string;
                    demand: string | null;
                }[];
            };
        })[];
    }[]>;
    setUserAvatar(userId: number, image: string): Promise<import(".prisma/client").user>;
    getUserAvatar(userId: number): Promise<string>;
    getUnreadNotificationsCount(userId: number): Promise<number>;
    savePrescription(data: string): Promise<void>;
}
