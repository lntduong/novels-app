'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Clock, Eye, Globe } from 'lucide-react'
import ViewTracker from '@/components/view-tracker'
import { useTranslation } from '@/components/providers/language-provider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'

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
    genres?: { id: string, name: string, slug: string }[]
}

interface StoryClientPageProps {
    story: Story
}

export default function StoryClientPage({ story }: StoryClientPageProps) {
    const { t, language, setLanguage } = useTranslation()
    const firstChapter = story.chapters[0]
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [lastReadChapter, setLastReadChapter] = useState<{ slug: string, order: number } | null>(null)
    const [isLoadingUser, setIsLoadingUser] = useState(true)

    useEffect(() => {
        // Check bookmark and history on mount
        const checkUserData = async () => {
            try {
                // Check bookmark
                const bookmarkRes = await fetch(`/api/user/bookmarks/check?storyId=${story.id}`)
                const bookmarkData = await bookmarkRes.json()
                if (bookmarkData.isBookmarked) setIsBookmarked(true)

                // Check history
                const historyRes = await fetch(`/api/user/history?storyId=${story.id}`)
                const historyData = await historyRes.json()
                if (historyData.history && historyData.history.length > 0) {
                    const latest = historyData.history[0]
                    setLastReadChapter({
                        slug: latest.chapter.slug,
                        order: latest.chapter.order
                    })
                }
            } catch (error) {
                console.error('Failed to check user data', error)
            } finally {
                setIsLoadingUser(false)
            }
        }
        checkUserData()
    }, [story.id])

    const toggleBookmark = async () => {
        try {
            const res = await fetch('/api/user/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storyId: story.id })
            })
            if (res.status === 401) {
                alert('Please login to bookmark stories')
                return
            }
            if (res.ok) {
                const data = await res.json()
                setIsBookmarked(data.isBookmarked)
            }
        } catch (error) {
            console.error('Failed to toggle bookmark', error)
        }
    }

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
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <ThemeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm">
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

            {/* Hero Section with Cover */}
            <div className="bg-gradient-to-b from-orange-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('public.story.back_home')}
                            </Button>
                        </Link>
                        <Link href="/library">
                            <Button variant="outline" size="sm" className="hidden sm:flex">
                                <BookOpen className="h-4 w-4 mr-2" />
                                My Library
                            </Button>
                        </Link>
                    </div>

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
                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 flex-1 mr-4">
                                    {story.title}
                                </h1>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className={`rounded-full shrink-0 ${isBookmarked ? 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' : ''}`}
                                    onClick={toggleBookmark}
                                    title="Add to Library"
                                >
                                    {isBookmarked ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                                    )}
                                </Button>
                            </div>

                            {story.authorName && (
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                    {t('public.story.author')}: <span className="font-medium text-primary">{story.authorName}</span>
                                </p>
                            )}

                            {/* Genres */}
                            {story.genres && story.genres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {story.genres.map(genre => (
                                        <Link
                                            key={genre.id}
                                            href={`/search?genres=${genre.slug}`}
                                            className="px-3 py-1 bg-orange-100 dark:bg-gray-700 text-orange-800 dark:text-orange-200 rounded-full text-sm hover:bg-orange-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            {genre.name}
                                        </Link>
                                    ))}
                                </div>
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
                            <div className="flex flex-wrap gap-4">
                                {firstChapter && (
                                    <Link href={`/story/${story.slug}/${firstChapter.slug}`}>
                                        <Button size="lg" className="w-full sm:w-auto" variant={lastReadChapter ? "outline" : "default"}>
                                            <BookOpen className="w-5 h-5 mr-2" />
                                            {t('public.story.read_now')}
                                        </Button>
                                    </Link>
                                )}

                                {lastReadChapter && (
                                    <Link href={`/story/${story.slug}/${lastReadChapter.slug}`}>
                                        <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                                            <Clock className="w-5 h-5 mr-2" />
                                            Continue (Ch. {lastReadChapter.order})
                                        </Button>
                                    </Link>
                                )}
                            </div>
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
