// See `backend/agrox-api/src/notification/helpers/notification-types.ts`
export type NotificationType = 'DIAGNOSIS' | 'QUOTATION' | 'PRESCRIPTION' | 'MESSAGE' | 'TERMS' | 'APPUPDATE';

export function translateNotificationType(code: number): NotificationType {
	return (['DIAGNOSIS', 'QUOTATION', 'PRESCRIPTION', 'MESSAGE', 'TERMS', 'APPUPDATE'] as const)[code];
}
