import { AddressRegistrationDTO, FarmRegistrationDTO, UserRegistrationDTO, FieldRegistrationDTO, AreaRegistrationDTO, CropRegistrationDTO, RegistrationDTO } from './farm.controller';
export declare class FarmService {
    private readonly logger;
    registerFarmBulk(data: RegistrationDTO): Promise<void>;
    registerFarm(farmData: FarmRegistrationDTO, addressData: AddressRegistrationDTO): Promise<number>;
    registerUser(userData: UserRegistrationDTO, farmId: number): Promise<void>;
    registerField(areaData: AreaRegistrationDTO, fieldData: FieldRegistrationDTO, cropData: CropRegistrationDTO, famrId: number): Promise<void>;
}
