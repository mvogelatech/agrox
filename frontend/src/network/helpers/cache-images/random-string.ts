const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function getRandomString(length = 50): string {
	return [...new Array(length)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
}
