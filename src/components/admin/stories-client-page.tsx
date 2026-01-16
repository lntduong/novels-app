'use client'

import React from 'react'
import Link from 'next/link'
import { Plus, BookOpen, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/providers/language-provider'

interface Story {
    id: string
    title: string
    slug: string
    status: string
    createdAt: string
    coverImage: string | null
    _count: {
        chapters: number
    }
}

interface StoriesClientPageProps {
    stories: Story[]
}

export default function StoriesClientPage({ stories }: StoriesClientPageProps) {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('admin.stories.title')}
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {t('admin.stories.subtitle')}
                    </p>
                </div>
                <Link href="/admin/stories/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('admin.stories.new_button')}
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stories.map((story) => (
                    <Card key={story.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden border-gray-200 dark:border-gray-700 flex flex-row h-full">
                        {/* Cover Image Section - Fixed Aspect Ratio 2:3 for Books */}
                        <div className="relative w-32 shrink-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700">
                            <div className="aspect-[2/3] w-full h-full relative">
                                {story.coverImage ? (
                                    <img
                                        src={story.coverImage}
                                        alt={story.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                                        <BookOpen className="h-8 w-8 opacity-40" />
                                    </div>
                                )}

                                <div className="absolute top-2 left-2">
                                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full backdrop-blur-md shadow-sm border ${story.status === 'PUBLISHED'
                                        ? 'bg-green-100/90 text-green-800 border-green-200 dark:bg-green-900/90 dark:text-green-200 dark:border-green-800'
                                        : story.status === 'DRAFT'
                                            ? 'bg-yellow-100/90 text-yellow-800 border-yellow-200 dark:bg-yellow-900/90 dark:text-yellow-200 dark:border-yellow-800'
                                            : 'bg-gray-100/90 text-gray-800 border-gray-200 dark:bg-gray-900/90 dark:text-gray-200 dark:border-gray-800'
                                        }`}>
                                        {t(`status.${story.status}`)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <CardContent className="flex-1 p-4 flex flex-col justify-between min-w-0">
                            <div className="mb-3">
                                <h3 className="font-bold text-lg leading-tight mb-1.5 line-clamp-2 group-hover:text-primary transition-colors" title={story.title}>
                                    {story.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        {t('admin.stories.chapters_count', { count: story._count.chapters })}
                                    </span>
                                    <span className="w-0.5 h-3 bg-gray-300 dark:bg-gray-600 rounded-full" />
                                    <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
                                <Link href={`/story/${story.slug}`} className="w-full" target="_blank">
                                    <Button variant="outline" size="sm" className="w-full h-8 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs">
                                        {t('common.view')}
                                    </Button>
                                </Link>
                                <Link href={`/admin/stories/${story.id}`} className="w-full">
                                    <Button variant="default" size="sm" className="w-full h-8 text-xs">
                                        <Edit className="h-3 w-3 mr-1.5" />
                                        {t('common.edit')}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {stories.length === 0 && (
                    <Card className="col-span-full">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t('admin.stories.no_stories')}
                            </p>
                            <Link href="/admin/stories/new">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('admin.stories.create_first')}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
