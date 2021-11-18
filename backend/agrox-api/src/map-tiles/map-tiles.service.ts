import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class MapTilesService {
	private readonly logger = new Logger(MapTilesService.name);
	private readonly storage = new Storage();

	async tileUrl(farmid: string, date: string, z: string, x: string, y: string) {
		// this bucket serves both production and dev environment , there is an permission for the dev backend to access it
		const bucketName = 'agroexplore-field-maps';
		const myBucket = this.storage.bucket(bucketName);
		const fileName = `farm-id-${farmid}/${date}/${z}/${x}/${y}.png`;

		const file = myBucket.file(fileName);
		const check = await file.exists();
		if (check[0]) {
			const buff = await file.download();
			return buff[0];
		}

		return null;
	}
}
