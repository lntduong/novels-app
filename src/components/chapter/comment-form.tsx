'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import AnonymousNamePicker from './anonymous-name-picker'

interface CommentFormProps {
    chapterId: string
}

export default function CommentForm({ chapterId }: CommentFormProps) {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [showNamePicker, setShowNamePicker] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!content.trim()) {
            toast.error('Vui lòng nhập nội dung bình luận')
            return
        }

        // Check if anonymous name is needed
        const savedName = localStorage.getItem('anonymous-name')
        const hasAuth = document.cookie.includes('sb-')

        if (!hasAuth && !savedName) {
            setShowNamePicker(true)
            return
        }

        await submitComment(savedName)
    }

    const submitComment = async (anonymousName: string | null) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/chapters/${chapterId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, anonymousName }),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to post comment')
            }

            setContent('')
            toast.success('Đã đăng bình luận!')

            // Refresh to show new comment
            setTimeout(() => {
                window.location.reload()
            }, 500)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể đăng bình luận')
        } finally {
            setLoading(false)
        }
    }

    const handleNameSelected = (name: string) => {
        setShowNamePicker(false)
        submitComment(name)
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-3">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    maxLength={500}
                    rows={3}
                    disabled={loading}
                    className="resize-none"
                />
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {content.length}/500
                    </span>
                    <Button type="submit" disabled={loading || !content.trim()} className="gap-2">
                        <Send className="w-4 h-4" />
                        Gửi bình luận
                    </Button>
                </div>
            </form>

            <AnonymousNamePicker
                open={showNamePicker}
                onSelect={handleNameSelected}
                onCancel={() => setShowNamePicker(false)}
            />
        </>
    )
}
