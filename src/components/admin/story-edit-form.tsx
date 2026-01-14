'use client'

import { useState, useEffect } from 'react'
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
import { ArrowLeft, Check } from 'lucide-react'

interface Story {
    id: string
    title: string
    authorName: string | null
    slug: string
    description: string | null
    coverImage: string | null
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    genres?: { id: string, name: string }[]
}

interface Genre {
    id: string
    name: string
}

export default function StoryEditForm({ story }: { story: Story }) {
    const { t } = useTranslation()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [availableGenres, setAvailableGenres] = useState<Genre[]>([])
    const [genresLoaded, setGenresLoaded] = useState(false)

    const [formData, setFormData] = useState({
        title: story.title,
        authorName: story.authorName || '',
        description: story.description || '',
        coverImage: story.coverImage || '',
        status: story.status,
        genreIds: story.genres?.map(g => g.id) || [] as string[],
    })

    // Fetch genres on mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await fetch('/api/genres')
                const data = await res.json()
                if (data.genres) {
                    setAvailableGenres(data.genres)
                }
            } catch (err) {
                console.error('Failed to fetch genres', err)
            } finally {
                setGenresLoaded(true)
            }
        }
        fetchGenres()
    }, [])

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
            alert(t('admin.stories.edit.success_update'))
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

                    <div className="space-y-3">
                        <Label>Genres</Label>
                        <div className="border rounded-md p-4 max-h-60 overflow-y-auto bg-white dark:bg-gray-950">
                            {!genresLoaded ? (
                                <p className="text-sm text-gray-500">Loading genres...</p>
                            ) : availableGenres.length === 0 ? (
                                <p className="text-sm text-gray-500">No genres found. Go to Genre settings to add some.</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {availableGenres.map((genre) => {
                                        const isSelected = formData.genreIds.includes(genre.id)
                                        return (
                                            <div
                                                key={genre.id}
                                                className={`
                                                    flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors
                                                    ${isSelected ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'}
                                                `}
                                                onClick={() => {
                                                    const newGenreIds = isSelected
                                                        ? formData.genreIds.filter(id => id !== genre.id)
                                                        : [...formData.genreIds, genre.id]
                                                    setFormData({ ...formData, genreIds: newGenreIds })
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    checked={isSelected}
                                                    onChange={() => { }} // Handle click on parent div
                                                    tabIndex={-1}
                                                />
                                                <span className="text-sm font-medium">{genre.name}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {availableGenres.filter(g => formData.genreIds.includes(g.id)).map(genre => (
                                <span key={genre.id} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
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
