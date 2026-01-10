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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                    <Card key={story.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${story.status === 'PUBLISHED'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : story.status === 'DRAFT'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                    }`}>
                                    {t(`status.${story.status}`)}
                                </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{story.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {t('admin.stories.chapters_count', { count: story._count.chapters })}
                                {' • '}
                                {new Date(story.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex space-x-2">
                                <Link href={`/story/${story.slug}`} className="flex-1" target="_blank">
                                    <Button variant="outline" className="w-full">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        {t('common.view')}
                                    </Button>
                                </Link>
                                <Link href={`/admin/stories/${story.id}`} className="flex-1">
                                    <Button variant="default" className="w-full">
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
