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
                    <Card key={story.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-gray-200 dark:border-gray-700 flex flex-col h-full bg-white dark:bg-gray-800 p-0 gap-0">
                        {/* Cinema Style Cover - Blur Background + Contained Image */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-900 group-hover:opacity-100 transition-opacity">
                            {story.coverImage ? (
                                <>
                                    {/* Blurred Background Layer */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110 dark:opacity-40"
                                        style={{ backgroundImage: `url(${story.coverImage})` }}
                                    />
                                    {/* Glass Overlay for better contrast */}
                                    <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />

                                    {/* Main Image - Contained & Centered - NO PADDING as requested */}
                                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                                        <img
                                            src={story.coverImage}
                                            alt={story.title}
                                            className="h-full object-contain shadow-lg transform transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                                    <BookOpen className="h-12 w-12 opacity-30" />
                                </div>
                            )}

                            {/* Status Badge - Floating Top Right */}
                            <div className="absolute top-3 right-3 z-20">
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md shadow-sm border ${story.status === 'PUBLISHED'
                                    ? 'bg-green-100/90 text-green-800 border-green-200 dark:bg-green-900/80 dark:text-green-100 dark:border-green-800'
                                    : story.status === 'DRAFT'
                                        ? 'bg-yellow-100/90 text-yellow-800 border-yellow-200 dark:bg-yellow-900/80 dark:text-yellow-100 dark:border-yellow-800'
                                        : 'bg-gray-100/90 text-gray-800 border-gray-200 dark:bg-gray-900/80 dark:text-gray-100 dark:border-gray-800'
                                    }`}>
                                    {t(`status.${story.status}`)}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <CardContent className="flex-1 p-5 flex flex-col">
                            <div className="mb-4">
                                <h3 className="font-bold text-lg leading-snug mb-2 line-clamp-1 group-hover:text-primary transition-colors" title={story.title}>
                                    {story.title}
                                </h3>

                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3 font-medium">
                                    <span className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                        <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                                        {t('admin.stories.chapters_count', { count: story._count.chapters })}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                    <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <Link href={`/story/${story.slug}`} className="w-full" target="_blank">
                                    <Button variant="outline" size="sm" className="w-full font-medium hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-transform">
                                        {t('common.view')}
                                    </Button>
                                </Link>
                                <Link href={`/admin/stories/${story.id}`} className="w-full">
                                    <Button variant="default" size="sm" className="w-full font-medium shadow-sm active:scale-95 transition-transform">
                                        <Edit className="h-3.5 w-3.5 mr-2" />
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
