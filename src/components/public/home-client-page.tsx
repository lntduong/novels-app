'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { useTranslation } from '@/components/providers/language-provider'

interface StoryWithCount {
    id: string
    title: string
    slug: string
    coverImage: string | null
    authorName: string | null
    description: string | null
    updatedAt: Date
    views: number
    _count: {
        chapters: number
    }
}

interface HomeClientPageProps {
    stories: StoryWithCount[]
    totalReads: number
    totalStories: number
    totalChapters: number
    user?: any
}

export default function HomeClientPage({ stories }: HomeClientPageProps) {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Stories Grid - now the main focus */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="bg-orange-500 w-1.5 h-8 rounded-full inline-block"></span>
                            {t('public.home.latest_updates')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 ml-3.5">
                            {t('public.home.latest_desc')}
                        </p>
                    </div>
                </div>

                {/* Story Cards */}
                {stories.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                        <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">{t('public.home.no_stories')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                        {stories.map((story) => (
                            <Link
                                key={story.id}
                                href={`/story/${story.slug}`}
                                className="group h-full block"
                            >
                                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-gray-800">
                                    {/* Cover Image */}
                                    <div className="aspect-[2/3] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                                        {story.coverImage ? (
                                            <img
                                                src={story.coverImage}
                                                alt={story.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700">
                                                <BookOpen className="w-12 h-12 text-orange-200 dark:text-gray-600" />
                                            </div>
                                        )}
                                        {/* Views Badge */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="text-white text-xs font-medium flex items-center gap-2">
                                                <span>👁️ {story.views.toLocaleString()}</span>
                                                <span>•</span>
                                                <span>{story._count.chapters} chương</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Story Info */}
                                    <div className="p-3 flex flex-col flex-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-sm sm:text-base">
                                            {story.title}
                                        </h3>
                                        {story.authorName && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {story.authorName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
