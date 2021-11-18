const NOTIFICATION_TYPE_TO_MAGIC_NUMBER = {
	DIAGNOSIS: 0,
	QUOTATION: 1,
	PRESCRIPTION: 2,
	MESSAGE: 3,
	TERMS: 4,
	APPUPDATE: 5,
};

export type NotificationType = keyof typeof NOTIFICATION_TYPE_TO_MAGIC_NUMBER;

export function notificationTypeToMagicNumber(type: NotificationType): number {
	return NOTIFICATION_TYPE_TO_MAGIC_NUMBER[type];
}
