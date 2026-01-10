'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Globe } from 'lucide-react'
import ReadingControls from '@/components/reader/reading-controls'
import ChapterRating from '@/components/chapter/chapter-rating'
import ChapterComments from '@/components/chapter/chapter-comments'
import CommentForm from '@/components/chapter/comment-form'
import SecureChapterReader from '@/components/chapter/secure-chapter-reader'
import { useTranslation } from '@/components/providers/language-provider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'

interface Chapter {
    id: string
    title: string
    slug: string
    content: string
    accessPassword?: string | null
    order: number
}

interface PrevNextChapter {
    id: string
    title: string
    slug: string
}

interface ChapterClientPageProps {
    chapter: Chapter
    story: {
        title: string
        slug: string
        chaptersCount: number
    }
    previousChapter: PrevNextChapter | null
    nextChapter: PrevNextChapter | null
    currentIndex: number
}

export default function ChapterClientPage({
    chapter,
    story,
    previousChapter,
    nextChapter,
    currentIndex,
}: ChapterClientPageProps) {
    const { t, language, setLanguage } = useTranslation()
    const progressPercent = ((currentIndex + 1) / story.chaptersCount) * 100

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-40">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <Link href={`/story/${story.slug}`}>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">{t('public.chapter.back_story')}</span>
                            </Button>
                        </Link>

                        <div className="flex-1 text-center">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {chapter.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t('public.chapter.chapter_progress', { current: currentIndex + 1, total: story.chaptersCount })}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <ReadingControls />
                            <ThemeToggle />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Globe className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setLanguage('vi')} className={language === 'vi' ? 'bg-orange-50 dark:bg-gray-700' : ''}>
                                        Tiếng Việt
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-orange-50 dark:bg-gray-700' : ''}>
                                        English
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapter Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        {chapter.title}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">{story.title}</p>
                </div>

                <SecureChapterReader
                    chapterId={chapter.id}
                    initialContent={chapter.accessPassword ? null : chapter.content}
                    isLocked={!!chapter.accessPassword}
                />

                {/* Navigation */}
                <div className="border-t border-gray-200 dark:border-gray-700 py-8">
                    <div className="flex flex-row gap-4 justify-between">
                        {previousChapter && (
                            <Link
                                href={`/story/${story.slug}/${previousChapter.slug}`}
                                className="flex-1 px-3 py-3 sm:px-6 sm:py-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">← {t('public.chapter.previous')}</p>
                                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1">{previousChapter.title}</p>
                            </Link>
                        )}
                        {nextChapter && (
                            <Link
                                href={`/story/${story.slug}/${nextChapter.slug}`}
                                className="flex-1 px-3 py-3 sm:px-6 sm:py-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-right"
                            >
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{t('public.chapter.next')} →</p>
                                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1">{nextChapter.title}</p>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Rating Section */}
                <ChapterRating chapterId={chapter.id} />

                {/* Comments Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {t('public.chapter.comments')}
                    </h3>
                    <div className="mb-6">
                        <CommentForm
                            chapterId={chapter.id}
                        />
                    </div>
                    <ChapterComments chapterId={chapter.id} />
                </div>
            </div>
        </div>
    )
}
