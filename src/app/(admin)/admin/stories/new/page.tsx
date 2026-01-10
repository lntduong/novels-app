'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUpload from '@/components/admin/image-upload'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/components/providers/language-provider'

export default function NewStoryPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        authorName: '',
        description: '',
        coverImage: '',
        status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || t('common.error_create'))
            }

            const { story } = await res.json()
            router.push(`/admin/stories/${story.id}`)
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.error'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/admin/stories">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('admin.stories.create_first')}
                </h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.stories.edit.info_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('admin.stories.edit.title_label')} *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={t('admin.stories.edit.placeholders.title')}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="authorName">{t('admin.stories.edit.author_label')}</Label>
                            <Input
                                id="authorName"
                                value={formData.authorName}
                                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                placeholder={t('admin.stories.edit.placeholders.author')}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">{t('admin.stories.edit.desc_label')}</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder={t('admin.stories.edit.placeholders.desc')}
                                rows={4}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('admin.stories.edit.cover_label')}</Label>
                            <ImageUpload
                                value={formData.coverImage}
                                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                                disabled={loading}
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('admin.stories.edit.cover_help')}
                            </p>
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

                        <div className="flex space-x-3">
                            <Button type="submit" disabled={loading}>
                                {loading ? t('common.saving') : t('common.create')}
                            </Button>
                            <Link href="/admin/stories">
                                <Button type="button" variant="outline" disabled={loading}>
                                    {t('common.cancel')}
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
