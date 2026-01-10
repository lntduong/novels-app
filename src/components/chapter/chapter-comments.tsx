'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, MessageSquare, User } from 'lucide-react'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTranslation } from '@/components/providers/language-provider'

interface Comment {
    id: string
    content: string
    displayName: string
    createdAt: string
    userId: string | null
}

interface ChapterCommentsProps {
    chapterId: string
    refreshTrigger?: number
}

export default function ChapterComments({ chapterId, refreshTrigger }: ChapterCommentsProps) {
    const { t, language } = useTranslation()
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)

    useEffect(() => {
        // Try to get current user ID from cookie
        const cookies = document.cookie.split(';')
        const authCookie = cookies.find(c => c.trim().startsWith('sb-'))
        setCurrentUserId(authCookie ? 'logged-in' : null)

        fetchComments()
    }, [chapterId, page, refreshTrigger])

    const fetchComments = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/chapters/${chapterId}/comments?page=${page}&limit=20`)
            const data = await res.json()
            setComments(data.comments)
            setTotalPages(data.totalPages)
        } catch (error) {
            console.error('Failed to fetch comments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteCommentId) return

        try {
            const res = await fetch(`/api/comments/${deleteCommentId}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to delete comment')
            }

            toast.success(t('public.comments.delete_success'))
            fetchComments()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t('public.comments.delete_error'))
        } finally {
            setDeleteCommentId(null)
        }
    }

    if (loading && comments.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('public.comments.loading')}
            </div>
        )
    }

    if (comments.length === 0) {
        return (
            <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                    {t('public.comments.empty')}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div
                    key={comment.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                    {comment.displayName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(comment.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                        {comment.userId && currentUserId && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => setDeleteCommentId(comment.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {comment.content}
                    </p>
                </div>
            ))}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-4">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        {t('public.chapter.previous')}
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        {t('public.comments.page_info', { current: page, total: totalPages })}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        {t('public.chapter.next')}
                    </Button>
                </div>
            )}

            <AlertDialog open={!!deleteCommentId} onOpenChange={(open) => !open && setDeleteCommentId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('public.comments.delete_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('public.comments.delete_confirm')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                            {t('common.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
