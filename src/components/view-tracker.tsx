'use client'

import { useEffect } from 'react'

export default function ViewTracker({ slug }: { slug: string }) {
    useEffect(() => {
        // Track view when component mounts
        fetch('/api/stories/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug }),
        }).catch(console.error)
    }, [slug])

    return null // This component doesn't render anything
}
