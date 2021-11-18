import { Controller, Request, Post, Get, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNotEmpty } from 'class-validator';
import { CheckoutService } from './checkout.service';
import { MailService } from '../mail/mail.service';
import { AgroRequest } from '../types';

export class CheckoutDto {
	@IsNotEmpty()
	selectedPrice!: string;

	@IsNotEmpty()
	quotationID!: number;
}

@Controller('checkout')
@UseGuards(JwtAuthGuard)
export class CheckoutController {
	constructor(readonly checkoutService: CheckoutService, readonly mailService: MailService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	async createCheckout(@Request() req: AgroRequest, @Body() checkout: CheckoutDto): Promise<string> {
		const createdCheckout = await this.checkoutService.createCheckout(req.user.userId!, checkout.selectedPrice, checkout.quotationID);

		const CHECKOUT_MAIL_DESTINATIONS = await this.checkoutService.getMails();
		const mailMessage = await this.checkoutService.getMessageData(req.user.userId!, createdCheckout);

		await this.mailService.sendMail({
			to: CHECKOUT_MAIL_DESTINATIONS,
			subject: `[Nova Pulverização] - Usuário: ${req.user.userId!} - ID do Checkout: ${createdCheckout.id}`,
			text: `${mailMessage}\n\n\nTimestamp: ${new Date().toISOString()}`,
		});

		return JSON.stringify(createdCheckout, undefined, '\t');
	}

	@Get()
	async getCheckoutGroups(@Request() req: AgroRequest): Promise<string> {
		const checkoutGroups = await this.checkoutService.getCheckoutGroups(req.user.userId!);
		return JSON.stringify(checkoutGroups, undefined, '\t');
	}
}
