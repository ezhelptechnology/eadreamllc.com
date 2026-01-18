'use client';

import { usePassiveEventListeners } from '@/hooks/usePassiveEventListeners';

export default function ClientOptimizations() {
    usePassiveEventListeners();
    return null;
}
