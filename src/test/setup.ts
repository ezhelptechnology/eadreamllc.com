import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn(),
    }),
    usePathname: () => '',
}));

// Mock Next-Auth
vi.mock('next-auth/react', () => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
    useSession: () => ({ data: null, status: 'unauthenticated' }),
}));
