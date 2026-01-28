import { prisma } from './prisma';

export async function logError(error: Error | string, options?: { source?: string, path?: string }) {
    const message = error instanceof Error ? error.message : error;
    const stack = error instanceof Error ? error.stack : null;

    console.error(`[ERROR] ${options?.source || 'APP'}: ${message}`, stack);

    try {
        await prisma.errorLog.create({
            data: {
                message,
                stack,
                source: options?.source || 'APP',
                path: options?.path || null,
            },
        });
    } catch (e) {
        console.error('Failed to log error to database:', e);
    }
}
