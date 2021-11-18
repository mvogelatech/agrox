import { Controller, Get } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function dbConnectionOk(): Promise<boolean> {
	try {
		await prisma.$queryRaw('SELECT 1+1 as result;');
		return true;
	} catch {
		return false;
	}
}

@Controller('deploy-info')
export class DeployInfoController {
	@Get()
	async deployInfo(): Promise<string> {
		const dbOk = await dbConnectionOk();
		// This file will be modified upon deployment to provide some simple information about the deploy.
		const info = '___AGROX_DEPLOY_INFO_HERE___';
		return `${info} | ${process.env.NODE_ENV ?? 'NODE_ENV not set!'} | DB connection ${dbOk ? 'OK' : 'NOT OK'}`;
	}
}
