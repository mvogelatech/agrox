"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationTypeToMagicNumber = void 0;
const NOTIFICATION_TYPE_TO_MAGIC_NUMBER = {
    DIAGNOSIS: 0,
    QUOTATION: 1,
    PRESCRIPTION: 2,
    MESSAGE: 3,
    TERMS: 4,
    APPUPDATE: 5,
};
function notificationTypeToMagicNumber(type) {
    return NOTIFICATION_TYPE_TO_MAGIC_NUMBER[type];
}
exports.notificationTypeToMagicNumber = notificationTypeToMagicNumber;
//# sourceMappingURL=notification-types.js.map