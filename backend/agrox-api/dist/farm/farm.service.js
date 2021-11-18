"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FarmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
function generateRandomUniquePassword(currentPasswords) {
    for (let i = 0; i < 1000; i++) {
        const generatedPassword = Math.floor(Math.random() * 10000).toFixed(0);
        if (!currentPasswords.includes(generatedPassword))
            return generatedPassword;
    }
    throw new Error(`can't generate a password.`);
}
let FarmService = FarmService_1 = class FarmService {
    constructor() {
        this.logger = new common_1.Logger(FarmService_1.name);
    }
    async registerFarmBulk(data) {
        var _a;
        const state = await prisma.state.findUnique({
            where: {
                initials: data.addressData.stateInitials,
            },
        });
        const existingFarm = await prisma.farm.findUnique({
            where: {
                social_name: data.farmData.socialName,
            },
            include: {
                address: true,
            },
        });
        let farmId = (_a = existingFarm === null || existingFarm === void 0 ? void 0 : existingFarm.id) !== null && _a !== void 0 ? _a : 0;
        if (farmId === 0) {
            const address = await prisma.address.create({
                data: {
                    street: data.addressData.street,
                    city: data.addressData.city,
                    number: data.addressData.number,
                    km: data.addressData.km,
                    postal_code: data.addressData.postalCode,
                    complement: data.addressData.complement,
                    neighborhood: data.addressData.neighborhood,
                    phone_number: data.addressData.phoneNumber,
                    contact_name: data.addressData.contactName,
                    state: { connect: { id: state === null || state === void 0 ? void 0 : state.id } },
                    farm: {
                        create: {
                            cnpj: data.farmData.cnpj,
                            social_name: data.farmData.socialName,
                            fantasy_name: data.farmData.fantasyName,
                            lat: data.farmData.lat,
                            long: data.farmData.long,
                        },
                    },
                },
                include: {
                    farm: true,
                },
            });
            const ourFarm = address.farm.find((f) => f.fantasy_name === data.farmData.fantasyName);
            if (!ourFarm) {
                this.logger.log(`Fazenda: ${data.farmData.fantasyName} não encontrada.`);
                throw new Error(`Fazenda: ${data.farmData.fantasyName} não encontrada.`);
            }
            farmId = ourFarm.id;
        }
        const currentPasswords = await prisma.user.findMany({ select: { password: true } });
        for (const userData of data.userListData) {
            const existingUser = await prisma.user.findUnique({
                where: {
                    username: userData.username,
                },
            });
            if (!existingUser) {
                const newPassword = generateRandomUniquePassword(currentPasswords.map(({ password }) => password));
                currentPasswords.push({ password: newPassword });
                const role = await prisma.role.findUnique({
                    where: {
                        name: userData.roleName,
                    },
                });
                const user = await prisma.user.create({
                    data: {
                        first_name: userData.firstName,
                        last_name: userData.lastName,
                        username: userData.username,
                        password: newPassword,
                        cpf: userData.cpf,
                        phone_number: userData.phoneNumber,
                        email: userData.email,
                        active: true,
                        creation_date: new Date(),
                        access_date: new Date(),
                        update_date: new Date(),
                        yellow_threshold: 0.5,
                        red_threshold: 1,
                        fcm_token: '',
                        user_role: {
                            create: {
                                role: { connect: { id: role === null || role === void 0 ? void 0 : role.id } },
                            },
                        },
                        many_user_has_many_farm: {
                            create: {
                                farm: { connect: { id: farmId } },
                            },
                        },
                    },
                });
                this.logger.log(`User inserted successfully id: ${user.id}`);
            }
        }
        const fieldInserts = [];
        for (const afcData of data.areaFieldCropListData) {
            let area = await prisma.area.findUnique({
                where: {
                    name_per_farm_un: {
                        name: afcData.areaData.name,
                        farm_id: farmId,
                    },
                },
            });
            if (!area) {
                area = await prisma.area.create({
                    data: {
                        code: afcData.areaData.code,
                        lat: afcData.areaData.lat,
                        long: afcData.areaData.long,
                        name: afcData.areaData.name,
                        state_initials: afcData.areaData.stateInitials,
                        city: afcData.areaData.city,
                        zone: afcData.areaData.zone,
                        farm: { connect: { id: farmId } },
                    },
                });
                this.logger.log(`Area inserted successfully id: ${area.id}`);
            }
            const field = await prisma.field.findUnique({
                where: {
                    name_per_area_un: {
                        name: afcData.fieldData.name,
                        area_id: area.id,
                    },
                },
            });
            if (!field) {
                const newfield = prisma.field.create({
                    data: {
                        code: afcData.fieldData.code,
                        area_ha: afcData.fieldData.areaHA,
                        lat: afcData.fieldData.lat,
                        long: afcData.fieldData.long,
                        coordinates: afcData.fieldData.coordinates,
                        name: afcData.fieldData.name,
                        area: { connect: { id: area.id } },
                        crop: {
                            create: {
                                crop_type: afcData.cropData.cropType,
                                variety: afcData.cropData.variety,
                                sowing_date: date_fns_1.parse(afcData.cropData.sowingDate, 'dd/MM/yyyy', new Date()),
                                expected_harvest_date: date_fns_1.parse(afcData.cropData.expectedHarvestDate, 'dd/MM/yyyy', new Date()),
                                number: afcData.cropData.number,
                                is_diagnosis_hired: true,
                            },
                        },
                    },
                });
                fieldInserts.push(newfield);
            }
        }
        await prisma.$transaction(fieldInserts);
        this.logger.log(`Fields/crops inserted successfully.`);
    }
    async registerFarm(farmData, addressData) {
        const state = await prisma.state.findUnique({
            where: {
                initials: addressData.stateInitials,
            },
        });
        const address = await prisma.address.create({
            data: {
                street: addressData.street,
                city: addressData.city,
                number: addressData.number,
                km: addressData.km,
                postal_code: addressData.postalCode,
                complement: addressData.complement,
                neighborhood: addressData.neighborhood,
                phone_number: addressData.phoneNumber,
                contact_name: addressData.contactName,
                state: { connect: { id: state === null || state === void 0 ? void 0 : state.id } },
            },
        });
        this.logger.log(`new address created id: ${address.id}`);
        const farm = await prisma.farm.create({
            data: {
                cnpj: farmData.cnpj,
                social_name: farmData.socialName,
                fantasy_name: farmData.fantasyName,
                lat: farmData.lat,
                long: farmData.long,
                address: { connect: { id: address.id } },
            },
        });
        this.logger.log(`new farm created id: ${farm.id}`);
        return farm.id;
    }
    async registerUser(userData, farmId) {
        const currentPasswords = await prisma.user.findMany({ select: { password: true } });
        const newPassword = generateRandomUniquePassword(currentPasswords.map(({ password }) => password));
        const newUser = await prisma.user.create({
            data: {
                first_name: userData.username,
                last_name: userData.lastName,
                username: userData.phoneNumber,
                password: newPassword,
                cpf: userData.cpf,
                phone_number: userData.phoneNumber,
                email: userData.email,
                active: true,
                creation_date: new Date(),
                access_date: new Date(),
                update_date: new Date(),
                yellow_threshold: 0.5,
                red_threshold: 1,
                fcm_token: '',
            },
        });
        this.logger.log(`Created a new user: ${newUser.id},  ${newUser.first_name}`);
        const role = await prisma.role.findUnique({
            where: {
                name: userData.roleName,
            },
        });
        const userRole = await prisma.user_role.create({
            data: {
                role: { connect: { id: role === null || role === void 0 ? void 0 : role.id } },
                user: { connect: { id: newUser === null || newUser === void 0 ? void 0 : newUser.id } },
            },
        });
        this.logger.log(`Created a new user role: ${userRole.id},  ${userData.roleName}`);
        const manyUserHasManyFarm = await prisma.many_user_has_many_farm.create({
            data: {
                farm: { connect: { id: farmId } },
                user: { connect: { id: newUser === null || newUser === void 0 ? void 0 : newUser.id } },
            },
        });
        this.logger.log(`Associated the user to a farm: ${manyUserHasManyFarm.farm_id},  user: ${manyUserHasManyFarm.user_id}`);
    }
    async registerField(areaData, fieldData, cropData, famrId) {
        let area = await prisma.area.findUnique({
            where: {
                name_per_farm_un: {
                    name: areaData.name,
                    farm_id: famrId,
                },
            },
        });
        if (!area) {
            area = await prisma.area.create({
                data: {
                    code: areaData.code,
                    lat: areaData.lat,
                    long: areaData.long,
                    name: areaData.name,
                    state_initials: areaData.stateInitials,
                    city: areaData.city,
                    zone: areaData.zone,
                    farm: { connect: { id: famrId } },
                },
            });
            this.logger.log(`Area inserted successfully id: ${area.id}`);
        }
        const field = await prisma.field.create({
            data: {
                code: fieldData.code,
                area_ha: fieldData.areaHA,
                lat: fieldData.lat,
                long: fieldData.long,
                coordinates: fieldData.coordinates,
                name: fieldData.name,
                area: { connect: { id: area.id } },
            },
        });
        this.logger.log(`Field inserted successfully id: ${field.id}`);
        if (cropData.cropType !== '' && cropData.variety !== '' && cropData.sowingDate !== '' && cropData.expectedHarvestDate !== '') {
            const crop = await prisma.crop.create({
                data: {
                    crop_type: cropData.cropType,
                    variety: cropData.variety,
                    sowing_date: date_fns_1.parse(cropData.sowingDate, 'dd/MM/yyyy', new Date()),
                    expected_harvest_date: date_fns_1.parse(cropData.expectedHarvestDate, 'dd/MM/yyyy', new Date()),
                    number: cropData.number,
                    is_diagnosis_hired: true,
                    field: { connect: { id: field.id } },
                },
            });
            this.logger.log(`Crop inserted successfully id: ${crop.id}`);
        }
    }
};
FarmService = FarmService_1 = __decorate([
    common_1.Injectable()
], FarmService);
exports.FarmService = FarmService;
//# sourceMappingURL=farm.service.js.map