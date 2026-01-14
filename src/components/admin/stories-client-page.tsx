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
                    <Card key={story.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden border-gray-200 dark:border-gray-700">
                        <div className="relative aspect-[2/1] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            {story.coverImage ? (
                                <img
                                    src={story.coverImage}
                                    alt={story.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <BookOpen className="h-12 w-12 opacity-50" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full backdrop-blur-md shadow-sm border ${story.status === 'PUBLISHED'
                                    ? 'bg-green-100/90 text-green-800 border-green-200 dark:bg-green-900/90 dark:text-green-200 dark:border-green-800'
                                    : story.status === 'DRAFT'
                                        ? 'bg-yellow-100/90 text-yellow-800 border-yellow-200 dark:bg-yellow-900/90 dark:text-yellow-200 dark:border-yellow-800'
                                        : 'bg-gray-100/90 text-gray-800 border-gray-200 dark:bg-gray-900/90 dark:text-gray-200 dark:border-gray-800'
                                    }`}>
                                    {t(`status.${story.status}`)}
                                </span>
                            </div>
                        </div>

                        <CardContent className="p-4">
                            <div className="mb-4">
                                <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors" title={story.title}>
                                    {story.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <span>{t('admin.stories.chapters_count', { count: story._count.chapters })}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                    <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Link href={`/story/${story.slug}`} className="w-full" target="_blank">
                                    <Button variant="outline" size="sm" className="w-full hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        {t('common.view')}
                                    </Button>
                                </Link>
                                <Link href={`/admin/stories/${story.id}`} className="w-full">
                                    <Button variant="default" size="sm" className="w-full">
                                        <Edit className="h-4 w-4 mr-2" />
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
