"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const treeShortcut = require("tree-shortcut");
const groupBy = require("lodash.groupby");
const prisma = new client_1.PrismaClient();
function formatDate(Date) {
    const date = Date.toISOString();
    const dateArray = date.slice(0, 10).split('-');
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
}
let CheckoutService = class CheckoutService {
    async getMails() {
        const mail = await prisma.email.findMany();
        return mail.map((mail) => mail.email);
    }
    async getCheckout() {
        const quotationCheckout = await prisma.quotation_checkout.findMany({
            include: {
                quotation: { include: { quotation_modal_package: { include: { quotation_package: true } } } },
            },
        });
        return quotationCheckout;
    }
    async getCheckoutGroups(userId) {
        const quotationCheckouts = treeShortcut(await prisma.quotation_checkout.findMany({
            include: {
                quotation: {
                    include: {
                        quotation_modal_package: {
                            include: {
                                quotation_package: true,
                                many_quotation_modal_package_has_many_field: {
                                    include: {
                                        field: {
                                            include: {
                                                area: { include: { farm: { include: { many_user_has_many_farm: true } } } },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }), 'many_quotation_modal_package_has_many_field', 'field', 'field');
        const userCheckouts = new Set();
        for (const checkout of quotationCheckouts) {
            for (const field of checkout.quotation.quotation_modal_package.field) {
                if (field.area.farm.many_user_has_many_farm[0].user_id === userId) {
                    userCheckouts.add(checkout);
                }
            }
        }
        return Object.values(groupBy([...userCheckouts], (checkout) => checkout.quotation.quotation_modal_package.quotation_package.id));
    }
    async getMessageData(id, checkoutPackage) {
        var _a;
        const message = [];
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new Error(`Unable to find user with id '${id}'`);
        const fields = await prisma.many_quotation_modal_package_has_many_field.findMany({
            where: { id_quotation_modal_package: checkoutPackage.quotation.quotation_modal_package.id },
            include: { field: { include: { area: { include: { farm: { include: { address: true } } } } } } },
        });
        const farmAddress = (await prisma.address.findUnique({ where: { id: fields[0].field.area.farm.address_id } }));
        const farmState = (await prisma.state.findUnique({ where: { id: farmAddress.state_id } })).initials;
        message.push(this.rightPadStringWithDashes('\n\n\nDados do Produtor', 120));
        message.push(`Nome: ${user.first_name} ${user.last_name}`);
        message.push(`Celular: ${user.phone_number}`);
        message.push(`Email: ${(_a = user.email) !== null && _a !== void 0 ? _a : '-'}`);
        message.push(this.rightPadStringWithDashes('\nDados da Fazenda', 120));
        message.push(`Nome: ${fields[0].field.area.farm.fantasy_name}`);
        message.push(`Endereço: ${farmAddress.street} Nº: ${farmAddress.number}, Bairro: ${farmAddress.neighborhood}, CEP: ${farmAddress.postal_code} - ${farmAddress.city}, ${farmState}`);
        message.push(`Coordenadas: LAT: ${fields[0].field.area.farm.lat} LONG:${fields[0].field.area.farm.long}`);
        message.push(this.rightPadStringWithDashes('\nDetalhes do Pedido', 120));
        message.push(`Data de Pulverização: ${formatDate(checkoutPackage.quotation.quotation_modal_package.quotation_package.pulverization_start_date)} até ${formatDate(checkoutPackage.quotation.quotation_modal_package.quotation_package.pulverization_end_date)}`);
        message.push(`Áreas: ${[...new Set(checkoutPackage.quotation.quotation_modal_package.field.flatMap((field) => field.area.name.split(' ')[1]))]
            .slice()
            .sort(undefined)
            .join(', ')}`);
        message.push(`Talhões: ${[...new Set(checkoutPackage.quotation.quotation_modal_package.field.map((field) => field.name.split(' ')[1]))]
            .slice()
            .sort(undefined)
            .join(', ')}`);
        return message.join('\n');
    }
    async createCheckout(userId, selectedPrice, quotationID) {
        const checkout = await prisma.quotation_checkout.create({
            data: {
                checkout_date: new Date(),
                selected_price: this.getPriceAsEnum(selectedPrice),
                quotation: {
                    connect: { id: quotationID },
                },
            },
        });
        return (await this.getCheckoutById(checkout.id));
    }
    async getCheckoutById(id) {
        const quotationCheckout = treeShortcut(await prisma.quotation_checkout.findUnique({
            where: {
                id,
            },
            include: {
                quotation: {
                    include: {
                        quotation_modal_package: {
                            include: {
                                quotation_package: true,
                                many_quotation_modal_package_has_many_field: {
                                    include: {
                                        field: {
                                            include: {
                                                area: { include: { farm: { include: { many_user_has_many_farm: true } } } },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }), 'many_quotation_modal_package_has_many_field', 'field', 'field');
        return quotationCheckout;
    }
    getPriceAsEnum(price) {
        if (price === 'antecipated_price')
            return 0;
        if (price === 'cash_price')
            return 1;
        return 2;
    }
    rightPadStringWithDashes(string, length) {
        const lastLineSize = string.replace(/[\s\S]*\n/, '').length;
        if (lastLineSize >= length)
            return string;
        return `${string} ${'-'.repeat(length - 1 - lastLineSize)}`;
    }
};
CheckoutService = __decorate([
    common_1.Injectable()
], CheckoutService);
exports.CheckoutService = CheckoutService;
//# sourceMappingURL=checkout.service.js.map