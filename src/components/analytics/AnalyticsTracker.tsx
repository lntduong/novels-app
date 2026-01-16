'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const sentPath = useRef<string | null>(null);

    useEffect(() => {
        // Prevent double counting in Strict Mode or if pathname hasn't actually changed
        if (sentPath.current === pathname) return;

        const trackPage = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: pathname }),
                });
                sentPath.current = pathname;
            } catch (error) {
                console.error('Tracking failed', error);
            }
        };

        trackPage();
    }, [pathname]);

    return null;
}
