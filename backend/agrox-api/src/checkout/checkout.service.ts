import { Injectable } from '@nestjs/common';
import { PrismaClient, quotation_checkout } from '@prisma/client';
import treeShortcut = require('tree-shortcut');
import groupBy = require('lodash.groupby');

const prisma = new PrismaClient();

function formatDate(Date: Date) {
	const date = Date.toISOString();
	const dateArray = date.slice(0, 10).split('-');
	return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
}

@Injectable()
export class CheckoutService {
	async getMails(): Promise<string[]> {
		const mail = await prisma.email.findMany();
		return mail.map((mail) => mail.email);
	}

	async getCheckout(): Promise<quotation_checkout[]> {
		const quotationCheckout = await prisma.quotation_checkout.findMany({
			include: {
				quotation: { include: { quotation_modal_package: { include: { quotation_package: true } } } },
			},
		});

		return quotationCheckout;
	}

	// If there is a change here, change also 'getCheckoutById' down here
	async getCheckoutGroups(userId: number): Promise<quotation_checkout[][]> {
		const quotationCheckouts = treeShortcut(
			await prisma.quotation_checkout.findMany({
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
			}),
			'many_quotation_modal_package_has_many_field',
			'field',
			'field',
		);

		type QuotationCheckoutWithIncludes = typeof quotationCheckouts[0];

		const userCheckouts = new Set<QuotationCheckoutWithIncludes>();

		for (const checkout of quotationCheckouts) {
			for (const field of checkout.quotation.quotation_modal_package.field) {
				if (field.area.farm.many_user_has_many_farm[0].user_id === userId) {
					userCheckouts.add(checkout);
				}
			}
		}

		return Object.values(groupBy([...userCheckouts], (checkout) => checkout.quotation.quotation_modal_package.quotation_package.id));
	}

	async getMessageData(id: number, checkoutPackage: any): Promise<string> {
		const message: string[] = [];
		const user = await prisma.user.findUnique({ where: { id } });

		if (!user) throw new Error(`Unable to find user with id '${id}'`);

		const fields = await prisma.many_quotation_modal_package_has_many_field.findMany({
			where: { id_quotation_modal_package: checkoutPackage.quotation.quotation_modal_package.id },
			include: { field: { include: { area: { include: { farm: { include: { address: true } } } } } } },
		});

		const farmAddress = (await prisma.address.findUnique({ where: { id: fields[0].field.area.farm.address_id } }))!;
		const farmState = (await prisma.state.findUnique({ where: { id: farmAddress.state_id } }))!.initials;

		message.push(this.rightPadStringWithDashes('\n\n\nDados do Produtor', 120));
		message.push(`Nome: ${user.first_name} ${user.last_name}`);
		message.push(`Celular: ${user.phone_number}`);
		message.push(`Email: ${user.email ?? '-'}`);
		message.push(this.rightPadStringWithDashes('\nDados da Fazenda', 120));
		message.push(`Nome: ${fields[0].field.area.farm.fantasy_name}`);
		message.push(
			`Endereço: ${farmAddress.street} Nº: ${farmAddress.number!}, Bairro: ${farmAddress.neighborhood!}, CEP: ${farmAddress.postal_code!} - ${
				farmAddress.city
			}, ${farmState}`,
		);
		message.push(`Coordenadas: LAT: ${fields[0].field.area.farm.lat!} LONG:${fields[0].field.area.farm.long!}`);
		message.push(this.rightPadStringWithDashes('\nDetalhes do Pedido', 120));
		message.push(
			`Data de Pulverização: ${formatDate(checkoutPackage.quotation.quotation_modal_package.quotation_package.pulverization_start_date)} até ${formatDate(
				checkoutPackage.quotation.quotation_modal_package.quotation_package.pulverization_end_date,
			)}`,
		);

		message.push(
			`Áreas: ${[...new Set(checkoutPackage.quotation.quotation_modal_package.field.flatMap((field: any) => field.area.name!.split(' ')[1]))]
				.slice()
				.sort(undefined)
				.join(', ')}`,
		);
		message.push(
			`Talhões: ${[...new Set(checkoutPackage.quotation.quotation_modal_package.field.map((field: any) => field.name.split(' ')[1]))]
				.slice()
				.sort(undefined)
				.join(', ')}`,
		);

		return message.join('\n');
	}

	async createCheckout(userId: number, selectedPrice: string, quotationID: number): Promise<quotation_checkout> {
		const checkout = await prisma.quotation_checkout.create({
			data: {
				checkout_date: new Date(),
				selected_price: this.getPriceAsEnum(selectedPrice),
				quotation: {
					connect: { id: quotationID },
				},
			},
		});

		return (await this.getCheckoutById(checkout.id))!;
	}

	// If there is a change here, change also 'getCheckoutGroups' up here
	private async getCheckoutById(id: number) {
		const quotationCheckout = treeShortcut(
			await prisma.quotation_checkout.findUnique({
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
			}),
			'many_quotation_modal_package_has_many_field',
			'field',
			'field',
		);

		return quotationCheckout;
	}

	private getPriceAsEnum(price: string) {
		if (price === 'antecipated_price') return 0;
		if (price === 'cash_price') return 1;
		return 2;
	}

	private rightPadStringWithDashes(string: string, length: number): string {
		const lastLineSize = string.replace(/[\s\S]*\n/, '').length;
		if (lastLineSize >= length) return string;
		return `${string} ${'-'.repeat(length - 1 - lastLineSize)}`;
	}
}
