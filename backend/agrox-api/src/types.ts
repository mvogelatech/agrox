import type { Request } from 'express';

export type AgroRequest = Request & { user: { userId: number | undefined } };
