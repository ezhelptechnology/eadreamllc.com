import { useEffect } from 'react';

/**
 * Optimizes scroll and touch event listeners to be passive
 * This improves INP (Interaction to Next Paint) performance
 */
export function usePassiveEventListeners() {
    useEffect(() => {
        // Override addEventListener to make scroll and touch events passive by default
        const originalAddEventListener = EventTarget.prototype.addEventListener;

        EventTarget.prototype.addEventListener = function (
            type: string,
            listener: EventListenerOrEventListenerObject,
            options?: boolean | AddEventListenerOptions
        ) {
            const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel', 'mousewheel'];

            if (passiveEvents.includes(type)) {
                const opts = typeof options === 'object' ? options : {};
                opts.passive = opts.passive !== false; // Default to passive unless explicitly false
                return originalAddEventListener.call(this, type, listener, opts);
            }

            return originalAddEventListener.call(this, type, listener, options);
        };

        return () => {
            // Restore original
            EventTarget.prototype.addEventListener = originalAddEventListener;
        };
    }, []);
}
