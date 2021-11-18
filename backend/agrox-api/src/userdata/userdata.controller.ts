import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { UserDataService } from './userdata.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('userdata')
export class UserDataController {
	constructor(readonly userDataService: UserDataService) {}

	@Get(':id')
	async getFarmDataByUserId(@Param('id') user_id: string): Promise<string> {
		const userId = Number.parseInt(user_id, 10);

		const data = await this.userDataService.getFarmDataByUserId(userId);
		return JSON.stringify(data, undefined, '\t');
	}

	@Get(':id/unread-notification-count')
	async getUnreadNotificationsCount(@Param('id') user_id: string): Promise<string> {
		const userId = Number.parseInt(user_id, 10);
		const data = await this.userDataService.getUnreadNotificationsCount(userId);
		return data.toString();
	}

	@Post(':id/avatar')
	@UseInterceptors(FileInterceptor('image'))
	uploadUserAvatar(
		@Param('id') user_id: string,
		@UploadedFile()
		image: {
			fieldname: string;
			originalname: string;
			encoding: string;
			mimetype: string;
			buffer: Buffer;
			size: number;
		},
	) {
		const b64string = image.buffer.toString(`base64`);
		void this.userDataService.setUserAvatar(Number.parseInt(user_id, 10), b64string);
	}

	@Get('avatar/:id')
	async downloadUserAvatar(@Param('id') user_id: string, @Res() res: Response) {
		const base64Img = await this.userDataService.getUserAvatar(Number.parseInt(user_id, 10));
		// return the base64 encoded image as string
		res.type('json').send({ image: base64Img });
	}
}
