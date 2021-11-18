"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = require("nodemailer");
const ensureError = require("ensure-error");
const nodemailerTransport = nodemailer_1.createTransport({
    service: 'Gmail',
    auth: {
        user: 'atechmvogel@gmail.com',
        pass: 'CAMARO@corvete17',
    },
});
let MailService = class MailService {
    async sendMail(mail) {
        console.log(`About to send a mail to ${JSON.stringify(mail.to)}`);
        console.log(`Subject: ${mail.subject}`);
        console.log(`Content: ${mail.text}`);
        if (nodemailerTransport) {
            try {
                const info = await nodemailerTransport.sendMail({
                    from: 'atechmvogel@gmail.com',
                    to: mail.to.join(', '),
                    subject: mail.subject,
                    text: mail.text,
                });
                const messageId = info && 'messageId' in info ? `` : '<unable to retrieve message id>';
                console.log(`Mail sent successfully: ${messageId}`);
            }
            catch (error) {
                console.log(`Failed to send mail due to error: ${ensureError(error).message}`);
                throw error;
            }
        }
        else {
            console.log('Skipping really sending the email this time since nodemailer auth data was not configured. This will not happen in the deployed backend.');
        }
    }
};
MailService = __decorate([
    common_1.Injectable()
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map