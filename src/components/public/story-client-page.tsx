'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Clock, Eye, Globe } from 'lucide-react'
import ViewTracker from '@/components/view-tracker'
import { useTranslation } from '@/components/providers/language-provider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Chapter {
    id: string
    title: string
    slug: string
    order: number
    createdAt: string | Date // Handle both for safety
}

interface Story {
    id: string
    title: string
    slug: string
    description: string | null
    coverImage: string | null
    authorName: string | null
    status: string
    views: number
    chapters: Chapter[]
}

interface StoryClientPageProps {
    story: Story
}

export default function StoryClientPage({ story }: StoryClientPageProps) {
    const { t, language, setLanguage } = useTranslation()
    const firstChapter = story.chapters[0]

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')
    }

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <ViewTracker slug={story.slug} />

            {/* Language Switcher - Absolute positioned */}
            <div className="absolute top-4 right-4 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                            <Globe className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLanguage('vi')} className={language === 'vi' ? 'bg-orange-50' : ''}>
                            Tiếng Việt
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-orange-50' : ''}>
                            English
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Hero Section with Cover */}
            <div className="bg-gradient-to-b from-orange-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="mb-6">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t('public.story.back_home')}
                        </Button>
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Cover Image */}
                        <div className="flex-shrink-0">
                            <div className="w-full md:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-gray-700 dark:to-gray-600">
                                {story.coverImage ? (
                                    <img
                                        src={story.coverImage}
                                        alt={story.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen className="w-20 h-20 text-orange-300 dark:text-gray-500" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Story Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                                {story.title}
                            </h1>

                            {story.authorName && (
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                    {t('public.story.author')}: <span className="font-medium text-primary">{story.authorName}</span>
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <BookOpen className="w-5 h-5" />
                                    <span>{t('public.home.chapters_count', { count: story.chapters.length })}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Eye className="w-5 h-5" />
                                    <span>
                                        {formatNumber(story.views)} {t('public.story.views')}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            {story.description && (
                                <div className="mb-6">
                                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-2">
                                        {t('public.story.intro')}
                                    </h2>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                        {story.description}
                                    </p>
                                </div>
                            )}

                            {/* CTA Button */}
                            {firstChapter && (
                                <Link href={`/story/${story.slug}/${firstChapter.slug}`}>
                                    <Button size="lg" className="w-full sm:w-auto">
                                        <BookOpen className="w-5 h-5 mr-2" />
                                        {t('public.story.read_now')}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapters List */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('public.story.chapters_list')}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('public.story.total_chapters', { count: story.chapters.length })}
                        </p>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {story.chapters.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-gray-400">{t('public.story.no_chapters')}</p>
                            </div>
                        ) : (
                            story.chapters.map((chapter) => (
                                <Link
                                    key={chapter.id}
                                    href={`/story/${story.slug}/${chapter.slug}`}
                                    className="block px-6 py-4 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="chapter-number flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
                                                    {chapter.order}
                                                </span>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                                                        {chapter.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                        {t('public.story.chapter_date', { date: formatDate(chapter.createdAt) })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary rotate-180 transition-colors" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
