import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';

@Injectable()
export class ImageServiceMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: () => void) {
		if (req.path.includes('images')) {
			res.sendFile(join(process.cwd(), req.path));
		} else {
			return next();
		}
	}
}
