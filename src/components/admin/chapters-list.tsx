'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from '@/components/providers/language-provider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Chapter {
    id: string
    title: string
    slug: string
    content: string
    order: number
    accessPassword?: string | null
}

interface ChaptersListProps {
    storyId: string
    initialChapters: Chapter[]
}

export default function ChaptersList({ storyId, initialChapters }: ChaptersListProps) {
    const { t } = useTranslation()
    const router = useRouter()
    const [chapters, setChapters] = useState(initialChapters)
    const [open, setOpen] = useState(false)
    const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
    const [loading, setLoading] = useState(false)

    // Sync chapters state when props change after router.refresh()
    useEffect(() => {
        setChapters(initialChapters)
    }, [initialChapters])

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        accessPassword: '',
    })

    const handleOpenNew = () => {
        setEditingChapter(null)
        setFormData({ title: '', content: '', accessPassword: '' })
        setOpen(true)
    }

    const handleEdit = (chapter: Chapter) => {
        setEditingChapter(chapter)
        setFormData({ title: chapter.title, content: chapter.content, accessPassword: chapter.accessPassword || '' })
        setOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (editingChapter) {
                // Update existing chapter
                const res = await fetch(`/api/chapters/${editingChapter.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })

                if (!res.ok) throw new Error('Failed to update chapter')
            } else {
                // Create new chapter
                const res = await fetch('/api/chapters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formData,
                        storyId,
                    }),
                })

                if (!res.ok) throw new Error('Failed to create chapter')
            }

            setOpen(false)
            router.refresh()
        } catch (error) {
            alert(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (chapterId: string) => {
        try {
            const res = await fetch(`/api/chapters/${chapterId}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete chapter')

            router.refresh()
        } catch (error) {
            alert(error instanceof Error ? error.message : 'An error occurred')
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{t('admin.stories.edit.chapters.chapter_list_title', { count: chapters.length })}</CardTitle>
                    <CardDescription>{t('admin.stories.edit.manage_chapters')}</CardDescription>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleOpenNew}>
                            <Plus className="h-4 w-4 mr-2" />
                            {t('admin.stories.edit.add_chapter')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingChapter ? t('admin.stories.edit.edit_chapter') : t('admin.stories.edit.new_chapter')}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">{t('admin.stories.edit.chapters.title_label')} *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder={t('admin.stories.edit.placeholders.chapter_title')}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">{t('admin.stories.edit.chapters.password_label')}</Label>
                                <Input
                                    id="password"
                                    value={formData.accessPassword}
                                    onChange={(e) => setFormData({ ...formData, accessPassword: e.target.value })}
                                    placeholder={t('admin.stories.edit.placeholders.password')}
                                    disabled={loading}
                                />
                                <p className="text-xs text-gray-500">
                                    {t('admin.stories.edit.chapters.password_help')}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">{t('admin.stories.edit.chapters.content_label')} *</Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder={t('admin.stories.edit.placeholders.chapter_content')}
                                    required
                                    rows={10}
                                    className="font-mono text-sm"
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                                    {t('common.cancel')}
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? t('common.saving') : t('common.save')}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {chapters.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        {t('admin.stories.edit.chapters.no_chapters')}
                    </p>
                ) : (
                    <div className="space-y-2">
                        {chapters.map((chapter) => (
                            <div
                                key={chapter.id}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-md"
                            >
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        {chapter.title}
                                        {chapter.accessPassword && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                                                {t('admin.stories.edit.chapters.locked')}
                                            </span>
                                        )}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {t('admin.stories.edit.chapters.details', { order: chapter.order, len: chapter.content.length })}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(chapter)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{t('admin.users.delete_confirm_title')}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {t('admin.stories.edit.chapters.delete_confirm')}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(chapter.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    {t('common.delete')}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
