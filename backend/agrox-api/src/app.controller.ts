import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AgroRequest } from './types';

@Controller()
export class AppController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req: AgroRequest): Promise<{ access_token: string }> {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@Request() req: AgroRequest) {
		return req.user;
	}
}
