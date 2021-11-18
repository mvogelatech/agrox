import { Module, HttpModule } from '@nestjs/common';
import { DeployInfoController } from './deploy-info/deploy-info.controller';
import { UserDataController } from './userdata/userdata.controller';
import { CompanyController } from './company/company.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { CromaiParserService } from './cromai/cromaitask.service';
import { UserDataService } from './userdata/userdata.service';
import { UserService } from './user/user.service';
import { CompanyService } from './company/company.service';
import { QuotationController } from './quotation/quotation.controller';
import { QuotationService } from './quotation/quotation.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { CheckoutController } from './checkout/checkout.controller';
import { CheckoutService } from './checkout/checkout.service';
import { MailService } from './mail/mail.service';
import { NotificationService } from './notification/notification.service';
import { RegisterFCMTokenController } from './notification/register-fcm-token.controller';
import { SendNotificationController, NotificationController } from './notification/send-notification.controller';
import { FieldMapService } from './field-map/field-map.service';
import { DiagnosisReportService } from './diagnosis-report/diagnosis-report.service';
import { DiagnosisReportController } from './diagnosis-report/diagnosis-report.controller';
import { TermsAndConditionsController } from './terms-and-conditions/terms-and-conditions.controller';
import { TermsAndConditionsService } from './terms-and-conditions/terms-and-conditions.service';
import { RecordService } from './record/record.service';
import { DemandService } from './demand/demand.service';

import { PrivacyPolicyController } from './privacy-policy/privacy-policy.controller';
import { PrivacyPolicyService } from './privacy-policy/privacy-policy.service';
import { FieldMapController } from './field-map/field-map.controller';
import { CromaiController } from './cromai/cromai.controller';
import { FarmController } from './farm/farm.controller';
import { FarmService } from './farm/farm.service';
import { VisionaController } from './visiona/visiona.controller';
import { VisionaService } from './visiona/visiona.service';
import { PlagueController } from './plague/plague.controller';
import { PlagueService } from './plague/plague.service';
import { MapTilesController } from './map-tiles/map-tiles.controller';
import { MapTilesService } from './map-tiles/map-tiles.service';
import { WebService } from './web/web.service';
import { WebController } from './web/web.controller';
import { DiagnosticService } from './diagnostic/diagnostic.service';
import { DiagnosticController } from './diagnostic/diagnostic.controller';
import { RecordController } from './record/record.controller';
import { DemandController } from './demand/demand.controller';

@Module({
	imports: [ScheduleModule.forRoot(), AuthModule, HttpModule],
	controllers: [
		DeployInfoController,
		UserDataController,
		CompanyController,
		AppController,
		QuotationController,
		CheckoutController,
		RegisterFCMTokenController,
		SendNotificationController,
		DiagnosisReportController,
		NotificationController,
		TermsAndConditionsController,
		PrivacyPolicyController,
		FieldMapController,
		CromaiController,
		FarmController,
		VisionaController,
		PlagueController,
		MapTilesController,
		WebController,
		DiagnosticController,
		RecordController,
		DemandController,
	],
	providers: [
		CromaiParserService,
		UserService,
		UserDataService,
		CompanyService,
		QuotationService,
		CheckoutService,
		MailService,
		FieldMapService,
		DiagnosisReportService,
		NotificationService,
		TermsAndConditionsService,
		PrivacyPolicyService,
		FarmService,
		VisionaService,
		PlagueService,
		MapTilesService,
		WebService,
		DiagnosticService,
		RecordService,
		DemandService,
	],
})
export class AppModule {}
