'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslation } from '@/components/providers/language-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUpload from '@/components/admin/image-upload'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Story {
    id: string
    title: string
    authorName: string | null
    slug: string
    description: string | null
    coverImage: string | null
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export default function StoryEditForm({ story }: { story: any }) {
    const { t } = useTranslation()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        title: story.title,
        authorName: story.authorName || '',
        description: story.description || '',
        coverImage: story.coverImage || '',
        status: story.status,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch(`/api/stories/${story.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to update story')
            }

            router.refresh()
            alert(t('admin.stories.edit.success_message'))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('admin.stories.edit.info_title')}</CardTitle>
                <Link href="/admin/stories">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('admin.stories.edit.back_to_stories')}
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>{t('admin.stories.edit.cover_label')}</Label>
                        <ImageUpload
                            value={formData.coverImage}
                            onChange={(url) => setFormData({ ...formData, coverImage: url })}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">{t('admin.stories.edit.title_label')} *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder={t('admin.stories.placeholders.title')}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="author">{t('admin.stories.edit.author_label')}</Label>
                        <Input
                            id="author"
                            value={formData.authorName}
                            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                            placeholder={t('admin.stories.placeholders.author')}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t('admin.stories.edit.desc_label')}</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder={t('admin.stories.placeholders.desc')}
                            rows={4}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">{t('common.status')}</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') =>
                                setFormData({ ...formData, status: value })
                            }
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DRAFT">{t('status.DRAFT')}</SelectItem>
                                <SelectItem value="PUBLISHED">{t('status.PUBLISHED')}</SelectItem>
                                <SelectItem value="ARCHIVED">{t('status.ARCHIVED')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <Button type="submit" disabled={loading}>
                        {loading ? t('common.saving') : t('admin.stories.edit.save_changes')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
