"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuotationData = void 0;
const client_1 = require("@prisma/client");
const jetpack = require("fs-jetpack");
const treeShortcut = require("tree-shortcut");
const prisma = new client_1.PrismaClient();
function haversineDistance(lat1, long1, lat2, long2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((long2 - long1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return (d / 1000).toFixed(0);
}
function calculateDistances(field, companies) {
    const distances = {};
    for (const company of companies) {
        const distance = Number(haversineDistance(field.lat, field.long, company.lat, company.long));
        distances[company.name] = distance;
    }
    return distances;
}
async function getQuotationData(id, outputPath) {
    const quotationPackage = treeShortcut(await prisma.quotation_package.findUnique({
        where: { id },
        include: {
            quotation_modal_package: {
                include: {
                    many_quotation_modal_package_has_many_field: {
                        include: { field: true },
                    },
                },
            },
        },
    }), 'many_quotation_modal_package_has_many_field', 'field', 'field');
    if (!quotationPackage)
        throw new Error(`Quotation with id ${id} not found.`);
    const companies = await prisma.company.findMany();
    const droneCompanies = companies.filter((company) => company.works_with_drone);
    const planeCompanies = companies.filter((company) => company.works_with_plane);
    const newQuotations = [];
    for (const modal of quotationPackage.quotation_modal_package) {
        const method = modal.pulverization_method === 1 ? 'Drone' : 'Avião';
        const localFields = modal.field.map((field) => ({
            name: field.name,
            distances: calculateDistances(field, method === 'Drone' ? droneCompanies : planeCompanies),
        }));
        newQuotations.push({
            modal: method.toLowerCase(),
            fields: localFields,
        });
    }
    jetpack.write(jetpack.path(`src/dev-scripts/temp/${outputPath}`), JSON.stringify(newQuotations, undefined, '\t'));
}
exports.getQuotationData = getQuotationData;
//# sourceMappingURL=make-quotation-json.js.map