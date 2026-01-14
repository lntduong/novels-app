'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, TrendingUp, Clock, Globe } from 'lucide-react'
import SearchBar from '@/components/search-bar'
import { useTranslation } from '@/components/providers/language-provider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'

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
}

export default function HomeClientPage({ stories, totalReads, totalStories, totalChapters }: HomeClientPageProps) {
    const { t, language, setLanguage } = useTranslation()

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-orange-100 dark:border-gray-700 relative">

                {/* Language Switcher - Absolute positioned for now as there is no public header */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <Link href="/library">
                        <Button variant="ghost" size="icon" className="rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm" title="My Library">
                            <BookOpen className="h-5 w-5" />
                        </Button>
                    </Link>
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

                <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            {t('public.home.hero_title_1')}
                            <span className="text-primary">{t('public.home.hero_title_2')}</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                            {t('public.home.hero_subtitle')}
                        </p>
                        <div className="mb-8">
                            <SearchBar />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl sm:text-3xl font-bold text-primary">{totalStories}+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('public.home.stats.stories')}</div>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-bold text-primary">
                                {totalChapters}+
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('public.home.stats.chapters')}</div>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-bold text-primary">
                                {totalReads >= 1000000 ? `${(totalReads / 1000000).toFixed(1)}M+` :
                                    totalReads >= 1000 ? `${(totalReads / 1000).toFixed(1)}K+` :
                                        totalReads}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('public.home.stats.reads')}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stories Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            {t('public.home.latest_updates')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {t('public.home.latest_desc')}
                        </p>
                    </div>
                    <Button variant="ghost" className="gap-2">
                        {t('public.home.view_all')}
                    </Button>
                </div>

                {/* Story Cards */}
                {stories.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">{t('public.home.no_stories')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {stories.map((story) => (
                            <Link
                                key={story.id}
                                href={`/story/${story.slug}`}
                                className="group h-full block"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200 h-full flex flex-col">
                                    {/* Cover Image */}
                                    <div className="aspect-[2/3] bg-gradient-to-br from-orange-100 to-orange-200 dark:from-gray-700 dark:to-gray-600 relative overflow-hidden flex-shrink-0">
                                        {story.coverImage ? (
                                            <img
                                                src={story.coverImage}
                                                alt={story.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-16 h-16 text-orange-300 dark:text-gray-500" />
                                            </div>
                                        )}
                                        {/* Views Badge */}
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                            <span>👁️ {story.views.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Story Info */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                            {story.title}
                                        </h3>
                                        {story.authorName && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {t('public.home.author')}: {story.authorName}
                                            </p>
                                        )}
                                        {story.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                                {story.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-auto">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                {t('public.home.chapters_count', { count: story._count.chapters })}
                                            </span>
                                        </div>
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
