import { Injectable } from '@nestjs/common';
import { createTransport as createNodemailerTransport } from 'nodemailer';
import ensureError = require('ensure-error');

export type Mail = {
	to: string[];
	subject: string;
	text: string;
};

const nodemailerTransport = createNodemailerTransport({
	service: 'Gmail',
	auth: {
		user: 'atechmvogel@gmail.com',
		pass: 'CAMARO@corvete17',
	},
});

@Injectable()
export class MailService {
	async sendMail(mail: Mail): Promise<void> {
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
				// Mail sent successfully: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
			} catch (error) {
				console.log(`Failed to send mail due to error: ${ensureError(error).message}`);
				throw error;
			}
		} else {
			console.log(
				'Skipping really sending the email this time since nodemailer auth data was not configured. This will not happen in the deployed backend.',
			);
		}
	}
}
