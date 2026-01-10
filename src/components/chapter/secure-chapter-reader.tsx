'use client'

import { useState, useEffect } from 'react'
import LockedChapter from '@/components/chapter/locked-chapter'

interface SecureChapterReaderProps {
    chapterId: string
    initialContent: string | null // null if locked
    isLocked: boolean
}

export default function SecureChapterReader({
    chapterId,
    initialContent,
    isLocked: initialLocked
}: SecureChapterReaderProps) {
    const [content, setContent] = useState<string | null>(initialContent)
    const [isLocked, setIsLocked] = useState(initialLocked)

    // Check localStorage on mount for auto-unlock
    useEffect(() => {
        if (isLocked) {
            const unlockedChapters = JSON.parse(localStorage.getItem('unlockedChapters') || '{}')
            const savedPassword = unlockedChapters[chapterId]

            if (savedPassword) {
                // Try to auto-unlock with saved password
                fetch(`/api/chapters/${chapterId}/unlock`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: savedPassword }),
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.content) {
                            setContent(data.content)
                            setIsLocked(false)
                        }
                    })
                    .catch(console.error)
            }
        }
    }, [chapterId, isLocked])

    if (isLocked) {
        return (
            <LockedChapter
                chapterId={chapterId}
                onUnlock={(newContent) => {
                    setContent(newContent)
                    setIsLocked(false)
                }}
            />
        )
    }

    if (!content) return null

    return (
        <div
            className="prose prose-lg dark:prose-invert max-w-none mb-16 text-justify leading-relaxed"
            style={{
                fontSize: 'var(--reading-font-size, 18px)',
                fontFamily: 'var(--reading-font-family, "Be Vietnam Pro", sans-serif)'
            }}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    )
}
