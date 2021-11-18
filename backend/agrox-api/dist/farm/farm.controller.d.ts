import { InputJsonObject } from '@prisma/client';
import { FarmService } from './farm.service';
export declare class UserRegistrationDTO {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    cpf: string;
    phoneNumber: string;
    email: string;
    roleName: string;
}
export declare class AddressRegistrationDTO {
    street: string;
    city: string;
    number: number;
    km: number;
    postalCode: string;
    complement: string;
    neighborhood: string;
    phoneNumber: string;
    contactName: string;
    stateInitials: string;
}
export declare class FarmRegistrationDTO {
    cnpj: string;
    socialName: string;
    fantasyName: string;
    lat: number;
    long: number;
}
export declare class AreaRegistrationDTO {
    code: number;
    lat: number;
    long: number;
    name: string;
    stateInitials: string;
    city: string;
    zone: string;
}
export declare class FieldRegistrationDTO {
    code: number;
    areaHA: number;
    lat: number;
    long: number;
    name: string;
    coordinates: InputJsonObject;
}
export declare class CropRegistrationDTO {
    cropType: string;
    variety: string;
    sowingDate: string;
    expectedHarvestDate: string;
    number: number;
}
export declare class AreaFieldCropRegistrationDTO {
    areaData: AreaRegistrationDTO;
    fieldData: FieldRegistrationDTO;
    cropData: CropRegistrationDTO;
}
export declare class RegistrationDTO {
    accessToken: string;
    farmData: FarmRegistrationDTO;
    addressData: AddressRegistrationDTO;
    userListData: UserRegistrationDTO[];
    areaFieldCropListData: AreaFieldCropRegistrationDTO[];
}
export declare class FarmController {
    private readonly farmService;
    constructor(farmService: FarmService);
    registerFarm(data: RegistrationDTO): Promise<void>;
}
