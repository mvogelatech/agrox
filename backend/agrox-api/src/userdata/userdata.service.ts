import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UserDataService {
	async getFarmDataByUserId(userId: number) {
		return prisma.user.findUnique({
			where: { id: userId },
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
}
