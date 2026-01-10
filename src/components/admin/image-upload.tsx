'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { useTranslation } from '@/components/providers/language-provider'

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    disabled?: boolean
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const { t } = useTranslation()
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [dragActive, setDragActive] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            await handleUpload(file)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleUpload(e.dataTransfer.files[0])
        }
    }

    const handleUpload = async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error(t('admin.stories.edit.image_upload.error_type'))
            return
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('admin.stories.edit.image_upload.error_size'))
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            onChange(data.url)
            toast.success(t('admin.stories.edit.image_upload.success'))
        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error instanceof Error ? error.message : t('admin.stories.edit.image_upload.error_generic'))
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleRemove = () => {
        onChange('')
    }

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative aspect-[2/3] w-40 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 group">
                    <Image
                        src={value}
                        alt={t('admin.stories.edit.image_upload.preview_alt')}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={handleRemove}
                            disabled={disabled}
                            type="button"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    className={`
                        relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors
                        ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={disabled || uploading}
                    />

                    {uploading ? (
                        <>
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            <p className="text-sm text-gray-500">{t('admin.stories.edit.image_upload.uploading')}</p>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Upload className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {t('admin.stories.edit.image_upload.drag_drop')}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {t('admin.stories.edit.image_upload.format_help')}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* URL Fallback */}
            <div className="flex items-center gap-2">
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t('admin.stories.edit.image_upload.placeholder_url')}
                    disabled={disabled || uploading}
                />
            </div>
        </div>
    )
}
