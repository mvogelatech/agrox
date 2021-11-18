"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const deploy_info_controller_1 = require("./deploy-info/deploy-info.controller");
const userdata_controller_1 = require("./userdata/userdata.controller");
const company_controller_1 = require("./company/company.controller");
const schedule_1 = require("@nestjs/schedule");
const cromaitask_service_1 = require("./cromai/cromaitask.service");
const userdata_service_1 = require("./userdata/userdata.service");
const user_service_1 = require("./user/user.service");
const company_service_1 = require("./company/company.service");
const quotation_controller_1 = require("./quotation/quotation.controller");
const quotation_service_1 = require("./quotation/quotation.service");
const auth_module_1 = require("./auth/auth.module");
const app_controller_1 = require("./app.controller");
const checkout_controller_1 = require("./checkout/checkout.controller");
const checkout_service_1 = require("./checkout/checkout.service");
const mail_service_1 = require("./mail/mail.service");
const notification_service_1 = require("./notification/notification.service");
const register_fcm_token_controller_1 = require("./notification/register-fcm-token.controller");
const send_notification_controller_1 = require("./notification/send-notification.controller");
const field_map_service_1 = require("./field-map/field-map.service");
const diagnosis_report_service_1 = require("./diagnosis-report/diagnosis-report.service");
const diagnosis_report_controller_1 = require("./diagnosis-report/diagnosis-report.controller");
const terms_and_conditions_controller_1 = require("./terms-and-conditions/terms-and-conditions.controller");
const terms_and_conditions_service_1 = require("./terms-and-conditions/terms-and-conditions.service");
const record_service_1 = require("./record/record.service");
const demand_service_1 = require("./demand/demand.service");
const privacy_policy_controller_1 = require("./privacy-policy/privacy-policy.controller");
const privacy_policy_service_1 = require("./privacy-policy/privacy-policy.service");
const field_map_controller_1 = require("./field-map/field-map.controller");
const cromai_controller_1 = require("./cromai/cromai.controller");
const farm_controller_1 = require("./farm/farm.controller");
const farm_service_1 = require("./farm/farm.service");
const visiona_controller_1 = require("./visiona/visiona.controller");
const visiona_service_1 = require("./visiona/visiona.service");
const plague_controller_1 = require("./plague/plague.controller");
const plague_service_1 = require("./plague/plague.service");
const map_tiles_controller_1 = require("./map-tiles/map-tiles.controller");
const map_tiles_service_1 = require("./map-tiles/map-tiles.service");
const web_service_1 = require("./web/web.service");
const web_controller_1 = require("./web/web.controller");
const diagnostic_service_1 = require("./diagnostic/diagnostic.service");
const diagnostic_controller_1 = require("./diagnostic/diagnostic.controller");
const record_controller_1 = require("./record/record.controller");
const demand_controller_1 = require("./demand/demand.controller");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [schedule_1.ScheduleModule.forRoot(), auth_module_1.AuthModule, common_1.HttpModule],
        controllers: [
            deploy_info_controller_1.DeployInfoController,
            userdata_controller_1.UserDataController,
            company_controller_1.CompanyController,
            app_controller_1.AppController,
            quotation_controller_1.QuotationController,
            checkout_controller_1.CheckoutController,
            register_fcm_token_controller_1.RegisterFCMTokenController,
            send_notification_controller_1.SendNotificationController,
            diagnosis_report_controller_1.DiagnosisReportController,
            send_notification_controller_1.NotificationController,
            terms_and_conditions_controller_1.TermsAndConditionsController,
            privacy_policy_controller_1.PrivacyPolicyController,
            field_map_controller_1.FieldMapController,
            cromai_controller_1.CromaiController,
            farm_controller_1.FarmController,
            visiona_controller_1.VisionaController,
            plague_controller_1.PlagueController,
            map_tiles_controller_1.MapTilesController,
            web_controller_1.WebController,
            diagnostic_controller_1.DiagnosticController,
            record_controller_1.RecordController,
            demand_controller_1.DemandController,
        ],
        providers: [
            cromaitask_service_1.CromaiParserService,
            user_service_1.UserService,
            userdata_service_1.UserDataService,
            company_service_1.CompanyService,
            quotation_service_1.QuotationService,
            checkout_service_1.CheckoutService,
            mail_service_1.MailService,
            field_map_service_1.FieldMapService,
            diagnosis_report_service_1.DiagnosisReportService,
            notification_service_1.NotificationService,
            terms_and_conditions_service_1.TermsAndConditionsService,
            privacy_policy_service_1.PrivacyPolicyService,
            farm_service_1.FarmService,
            visiona_service_1.VisionaService,
            plague_service_1.PlagueService,
            map_tiles_service_1.MapTilesService,
            web_service_1.WebService,
            diagnostic_service_1.DiagnosticService,
            record_service_1.RecordService,
            demand_service_1.DemandService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map