'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText } from 'lucide-react'
import { useTranslation } from '@/components/providers/language-provider'
import { useRouter } from 'next/navigation'

interface ParsedChapter {
    title: string
    content: string
    order: number
}

interface WordUploadProps {
    storyId: string
    onImportComplete?: (chapters: ParsedChapter[]) => void
}

export default function WordUpload({ storyId, onImportComplete }: WordUploadProps) {
    const { t } = useTranslation()
    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [chapters, setChapters] = useState<ParsedChapter[]>([])

    const processFile = async (file: File) => {
        if (!file) return

        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/upload/word', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Upload failed')
            }

            const data = await res.json()
            setChapters(data.chapters)

            if (onImportComplete) {
                onImportComplete(data.chapters)
            }
        } catch (err) {
            // Handle error, maybe display a toast or message
            console.error("File processing error:", err);
        } finally {
            setUploading(false)
        }
    }

    const saveChapters = async () => {
        if (chapters.length === 0) return

        setSaving(true)

        try {
            // Save chapters SEQUENTIALLY to maintain correct order
            for (let i = 0; i < chapters.length; i++) {
                const chapter = chapters[i]

                const res = await fetch('/api/chapters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: chapter.title,
                        content: chapter.content,
                        storyId,
                    }),
                })

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
                    throw new Error(`Failed to save "${chapter.title}": ${errorData.error}`)
                }
            }

            if (onImportComplete) {
                onImportComplete(chapters)
            }
            setChapters([]) // Clear chapters after saving
            router.refresh() // Refresh the page to update the chapters list
        } catch (err) {
            // Handle error, maybe display a toast or message
            console.error("Chapter saving error:", err);
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.stories.edit.upload_word')}</CardTitle>
                    <CardDescription>
                        {t('admin.stories.edit.word_upload_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <label
                            htmlFor="word-upload"
                            className={`
                                flex flex-col items-center justify-center w-full h-32
                                border-2 border-dashed rounded-lg cursor-pointer
                                hover:border-gray-400 transition-colors
                                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">{t('admin.stories.edit.click_upload')}</span> {t('admin.stories.edit.or_drag')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Word document (.docx)
                                </p>
                            </div>
                            <input
                                id="word-upload"
                                type="file"
                                accept=".docx"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) processFile(file)
                                }}
                                disabled={uploading}
                            />
                        </label>

                        {uploading && (
                            <div className="text-center text-sm text-blue-600 dark:text-blue-400">
                                {t('admin.stories.edit.processing')}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {chapters.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{t('admin.stories.edit.detected_chapters', { count: chapters.length })}</CardTitle>
                                <CardDescription>
                                    {t('admin.stories.edit.manage_chapters')}
                                </CardDescription>
                            </div>
                            <Button onClick={saveChapters} disabled={saving}>
                                {saving ? t('common.saving') : t('admin.stories.edit.save_all')}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {chapters.map((chapter, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                                >
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        {chapter.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-6">
                                        {t('admin.stories.edit.chapters.details', { order: chapter.order, len: chapter.content.length })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
