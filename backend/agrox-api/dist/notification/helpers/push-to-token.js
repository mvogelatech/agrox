"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotificationToToken = void 0;
const got_1 = require("got");
const SERVER_KEY = process.env.NOTIFICATIONS_SERVER_KEY;
const EXPERIENCE_ID = process.env.NOTIFICATIONS_EXPERIENCE_ID;
async function sendPushNotificationToToken(deviceToken, data) {
    await got_1.default
        .post('https://fcm.googleapis.com/fcm/send', {
        headers: {
            Authorization: `key=${SERVER_KEY}`,
        },
        json: {
            to: deviceToken,
            priority: 'normal',
            data: {
                experienceId: EXPERIENCE_ID,
                title: data.messageTitle,
                message: data.messageContent,
                body: {
                    agroNotification: data.agroNotification,
                    __agro_silent__: data.silent,
                },
            },
        },
    })
        .json();
}
exports.sendPushNotificationToToken = sendPushNotificationToToken;
//# sourceMappingURL=push-to-token.js.map