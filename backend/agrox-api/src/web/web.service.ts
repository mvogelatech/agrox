import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JsonValue } from 'type-fest';

const prisma = new PrismaClient();

type PrescriptionData = JsonValue & {
	drone: { comments: [string]; products: [JSON, JSON, JSON, JSON, JSON, JSON] };
	plane: { comments: [string]; products: [JSON, JSON, JSON, JSON, JSON, JSON] };
	terrestrial: { comments: [string]; products: [JSON, JSON, JSON, JSON, JSON, JSON] };
	recommended_method: number;
	diagnosis_id: number;
	author: string;
	whatsapp: string;
};

@Injectable()
export class WebService {
	async getFarmDataByUserId(userId: number) {
		return prisma.user.findMany({
			select: {
				id: true,
				first_name: true,
				last_name: true,
				username: true,
				password: true,
				phone_number: true,
				email: true,
				active: true,
				creation_date: true,
				access_date: true,
				update_date: true,
				yellow_threshold: true,
				red_threshold: true,
				fcm_token: true,
				avatar: false,
				user_accepted_terms: { orderBy: { accepted_date: 'desc' } },
				user_accepted_privacy_policy: { orderBy: { accepted_date: 'desc' } },
				user_role: { include: { role: true } },
				notification: { orderBy: { sent_date: 'desc' } },
				many_user_has_many_farm: {
					include: {
						farm: {
							include: {
								imaging: { orderBy: { processing_timestamp: 'desc' } },
								address: { include: { state: true } },
								area: {
									include: {
										field: {
											include: {
												crop: {
													include: {
														diagnosis: {
															include: {
																prescription: { orderBy: { date: 'desc' } },
																infestation: {
																	select: {
																		id: true,
																		plague: true,
																		area_ha: true,
																	},
																},
															},
															orderBy: { report_date: 'desc' },
														},
													},
													orderBy: { sowing_date: 'desc' },
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});
	}
	async getRequests() {
		// console.log('testesss');

		return prisma.user.findMany({
			select: {
				many_user_has_many_farm: {
					include: {
						farm: {
							include: {
								area: {
									select: {
										name: true,
										id: true,
										demand: true,
									},
								},
							},
						},
					},
				},
			},
		});
	}

	async setUserAvatar(userId: number, image: string) {
		return prisma.user.update({
			data: {
				avatar: image,
			},
			where: {
				id: userId,
			},
		});
	}

	async getUserAvatar(userId: number): Promise<string> {
		const currentUser = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				avatar: true,
			},
		});

		return currentUser ? currentUser.avatar ?? '' : '';
	}

	async getUnreadNotificationsCount(userId: number): Promise<number> {
		return prisma.notification.count({
			where: {
				user_id: userId,
				read_date: { equals: null },
			},
		});
	}

	async savePrescription(data: string) {
		const prescription = JSON.parse(data);

		// try {
		// 	console.log(prescription);
		// 	return prescription;
		// } catch (error) {
		// 	console.log(error);
		// }

		const diag = await prisma.diagnosis.findUnique({
			where: { id: prescription.diagnosis_id },
		});
		try {
			if (diag) {
				await prisma.prescription.create({
					data: {
						date: new Date(),
						content: prescription,
						pulverization_method: prescription.recommended_method,
						author: prescription.author,
						phone_number: prescription.whatsapp,
						diagnosis: { connect: { id: prescription.diagnosis_id } },
					},
				});
			} else {
				console.log(`no diagnosis for id: ${prescription.diagnosis_id}`);
			}
		} catch (error) {
			console.log(error);
		}
	}
}
