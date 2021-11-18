import { Injectable } from '@nestjs/common';
import treeShortcut = require('tree-shortcut');
import { PrismaClient, quotation_package } from '@prisma/client';

const prisma = new PrismaClient();

function formatDate(Date: Date) {
	const date = Date.toISOString();
	const dateArray = date.slice(0, 10).split('-');
	return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
}

@Injectable()
export class QuotationService {
	async getMails(): Promise<string[]> {
		const mail = await prisma.email.findMany();
		return mail.map((mail) => mail.email);
	}

	// If there is a change here, change also 'getQuotationPackageById' down here
	async getQuotationPackages(userId?: number): Promise<quotation_package[]> {
		const quotationPackages = treeShortcut(
			await prisma.quotation_package.findMany({
				include: {
					quotation_modal_package: {
						include: {
							quotation: {
								include: {
									company: {
										include: {
											address: { include: { state: true } },
										},
									},
								},
							},
							many_quotation_modal_package_has_many_field: {
								include: {
									field: {
										include: {
											area: { include: { farm: { include: { many_user_has_many_farm: true } } } },
											crop: { include: { diagnosis: { include: { prescription: { orderBy: { date: 'desc' } } } } } },
										},
									},
								},
							},
						},
					},
				},
			}),
			'many_quotation_modal_package_has_many_field',
			'field',
			'field',
		);

		if (userId === undefined) return quotationPackages;

		const userPackages = new Set<quotation_package>();

		for (const pkg of quotationPackages) {
			for (const modal of pkg.quotation_modal_package) {
				if (modal.field[0]?.area.farm.many_user_has_many_farm[0].user_id === userId) {
					userPackages.add(pkg);
				}
			}
		}

		return [...userPackages];
	}

	async getMessageData(id: number, quotationPackage: any): Promise<string> {
		const message: string[] = [];

		const user = await prisma.user.findUnique({ where: { id } });

		if (!user) throw new Error(`Unable to find user with id '${id}'`);

		const farmAddress = (await prisma.address.findUnique({
			where: { id: quotationPackage.quotation_modal_package[0].field[0].area.farm.address_id },
		}))!;
		const farmState = (await prisma.state.findUnique({ where: { id: farmAddress.state_id } }))!.initials;

		message.push(this.rightPadStringWithDashes('\n\n\nDados do Produtor', 120));
		message.push(`Nome: ${user.first_name} ${user.last_name}`);
		message.push(`Celular: ${user.phone_number}`);
		message.push(`Email: ${user.email ?? '-'}`);
		message.push(this.rightPadStringWithDashes('\nDados da Fazenda', 120));
		message.push(`Nome: ${quotationPackage.quotation_modal_package[0].field[0].area.farm.fantasy_name}`);
		message.push(
			`Endereço: ${farmAddress.street} Nº: ${farmAddress.number!}, Bairro: ${farmAddress.neighborhood!}, CEP: ${farmAddress.postal_code!} - ${
				farmAddress.city
			}, ${farmState}`,
		);
		message.push(
			`Coordenadas: LAT: ${quotationPackage.quotation_modal_package[0].field[0].area.farm.lat} LONG:${quotationPackage.quotation_modal_package[0].field[0].area.farm.long}`,
		);
		message.push(this.rightPadStringWithDashes('\nDetalhes do Orçamento', 120));
		message.push(
			`Data de Pulverização: ${formatDate(quotationPackage.pulverization_start_date)} até ${formatDate(quotationPackage.pulverization_end_date)}`,
		);
		message.push(
			`Áreas: ${[
				...new Set(quotationPackage.quotation_modal_package.flatMap((modal: any) => modal.field.flatMap((field: any) => field.area.name.split(' ')[1]))),
			]
				.slice()
				.sort(undefined)
				.join(', ')}`,
		);
		message.push(
			`Talhões: ${[...new Set(quotationPackage.quotation_modal_package.flatMap((modal: any) => modal.field.map((field: any) => field.name.split(' ')[1])))]
				.slice()
				.sort(undefined)
				.join(', ')}`,
		);
		return message.join('\n');
	}

	async createQuotationPackage(
		userId: number,
		pulverization_start_date: Date,
		pulverization_end_date: Date,
		fieldsWithMethods: Map<number, number>,
	): Promise<quotation_package> {
		const allPackages = treeShortcut(
			await prisma.quotation_package.findMany({
				include: {
					quotation_modal_package: {
						include: {
							many_quotation_modal_package_has_many_field: {
								include: { field: { include: { area: { include: { farm: { include: { many_user_has_many_farm: true } } } } } } },
							},
						},
					},
				},
			}),
			'many_quotation_modal_package_has_many_field',
			'field',
			'field',
		);

		let largest_code = 0;
		for (const pkg of allPackages) {
			if (pkg.quotation_modal_package[0]?.field[0]?.area.farm.many_user_has_many_farm[0].user_id === userId) {
				if (pkg.code > largest_code) largest_code = pkg.code;
			}
		}

		const pkg = await prisma.quotation_package.create({
			data: {
				code: largest_code + 1,
				pulverization_start_date,
				pulverization_end_date,
				request_date: new Date(),
			},
		});

		const hasDroneMethod = [...fieldsWithMethods.values()].some((method) => method === 1);
		const hasPlaneMethod = [...fieldsWithMethods.values()].some((method) => method === 2);

		const companies = await prisma.company.findMany();
		let drone_modal_pkg;
		let plane_modal_pkg;

		if (hasDroneMethod) {
			drone_modal_pkg = await prisma.quotation_modal_package.create({
				data: {
					pulverization_method: 1,
					quotation_package: {
						connect: { id: pkg.id },
					},
				},
			});

			for (const company of companies) {
				await prisma.quotation.create({
					data: {
						quotation_modal_package: {
							connect: { id: drone_modal_pkg.id },
						},
						company: {
							connect: { id: company.id },
						},
					},
				});
			}
		}

		if (hasPlaneMethod) {
			plane_modal_pkg = await prisma.quotation_modal_package.create({
				data: {
					pulverization_method: 2,
					quotation_package: {
						connect: { id: pkg.id },
					},
				},
			});

			for (const company of companies) {
				await prisma.quotation.create({
					data: {
						quotation_modal_package: {
							connect: { id: plane_modal_pkg.id },
						},
						company: {
							connect: {
								id: company.id,
							},
						},
					},
				});
			}
		}

		for (const [field_id, method] of fieldsWithMethods.entries()) {
			if (method !== 1 && method !== 2) throw new Error(`Unsupported method: ${method}`);
			const modal_pkg = method === 1 ? drone_modal_pkg : plane_modal_pkg;

			await prisma.many_quotation_modal_package_has_many_field.create({
				data: {
					field: {
						connect: { id: field_id },
					},

					quotation_modal_package: {
						connect: { id: modal_pkg!.id },
					},
				},
			});
		}

		return (await this.getQuotationPackageById(pkg.id))!;
	}

	// If there is a change here, change also 'getQuotationPackages' up here
	private async getQuotationPackageById(id: number) {
		const quotationPackage = treeShortcut(
			await prisma.quotation_package.findUnique({
				where: { id },
				include: {
					quotation_modal_package: {
						include: {
							quotation: {
								include: {
									company: {
										include: {
											address: { include: { state: true } },
										},
									},
								},
							},
							many_quotation_modal_package_has_many_field: {
								include: {
									field: {
										include: {
											area: { include: { farm: { include: { many_user_has_many_farm: true } } } },
											crop: { include: { diagnosis: { include: { prescription: { orderBy: { date: 'desc' } } } } } },
										},
									},
								},
							},
						},
					},
				},
			}),
			'many_quotation_modal_package_has_many_field',
			'field',
			'field',
		);
		return quotationPackage;
	}

	private rightPadStringWithDashes(string: string, length: number): string {
		const lastLineSize = string.replace(/[\s\S]*\n/, '').length;
		if (lastLineSize >= length) return string;
		return `${string} ${'-'.repeat(length - 1 - lastLineSize)}`;
	}
}
