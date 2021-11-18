"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CromaiParserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CromaiParserService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let CromaiParserService = CromaiParserService_1 = class CromaiParserService {
    constructor() {
        this.logger = new common_1.Logger(CromaiParserService_1.name);
    }
    async updateFieldPlagueDiagnosisData(diagnosisReportData) {
        const bulkTransactions = [];
        try {
            const plagueList = await prisma.plague.findMany();
            for (const [fieldIdString, diagnosisReport] of Object.entries(diagnosisReportData)) {
                const fieldId = JSON.parse(fieldIdString);
                const myField = (await prisma.field.findUnique({
                    where: {
                        id: fieldId.fieldId,
                    },
                    include: {
                        crop: { orderBy: { sowing_date: 'desc' } },
                    },
                }));
                if (!myField)
                    throw new Error(`There is valid field associated with this diagnosis data. Data: ${JSON.stringify(fieldIdString, null, '\t')}`);
                if (!myField.crop || myField.crop.length === 0)
                    throw new Error(`There is no crop associated with this field. Field: ${JSON.stringify(myField, null, '\t')}`);
                const diagnosisObject = await prisma.diagnosis.create({
                    data: {
                        crop: { connect: { id: myField.crop[0].id } },
                        report_date: new Date(Date.parse(diagnosisReport.reportDate)),
                        affected_area_ha: 0,
                    },
                });
                let totalAffectedArea = 0;
                for (const [plagueName, plagueData] of Object.entries(diagnosisReport.infestations)) {
                    const plagueDb = plagueList.find((p) => {
                        return p.name === plagueName;
                    });
                    if (plagueDb) {
                        const areaHA = plagueData.infectedArea / 10000;
                        totalAffectedArea += areaHA;
                        const newInfestation = prisma.infestation.upsert({
                            where: {
                                diagnosis_plague_un: {
                                    diagnosis_id: diagnosisObject.id,
                                    plague_id: plagueDb.id,
                                },
                            },
                            update: {
                                diagnosis: { connect: { id: diagnosisObject.id } },
                                plague: { connect: { id: plagueDb.id } },
                                area_ha: areaHA,
                                points: plagueData.points,
                            },
                            create: {
                                diagnosis: { connect: { id: diagnosisObject.id } },
                                plague: { connect: { id: plagueDb.id } },
                                area_ha: areaHA,
                                points: plagueData.points,
                            },
                        });
                        bulkTransactions.push(newInfestation);
                    }
                }
                await prisma.$transaction(bulkTransactions);
                await prisma.diagnosis.update({
                    data: {
                        crop: { connect: { id: myField.crop[0].id } },
                        affected_area_ha: totalAffectedArea,
                    },
                    where: {
                        id: diagnosisObject.id,
                    },
                });
            }
        }
        catch (error) {
            const message = `Cromai Parser Error: ${error.message}`;
            console.log(bulkTransactions);
            this.logger.error(message);
        }
    }
};
CromaiParserService = CromaiParserService_1 = __decorate([
    common_1.Injectable()
], CromaiParserService);
exports.CromaiParserService = CromaiParserService;
//# sourceMappingURL=cromaitask.service.js.map