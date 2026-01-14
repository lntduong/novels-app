'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Clock, Trash2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/components/providers/language-provider'

interface Story {
    id: string
    title: string
    slug: string
    coverImage: string | null
    authorName: string | null
    status: string
    updatedAt: string
    _count: {
        chapters: number
    }
}

interface BookmarkItem {
    id: string
    story: Story
    createdAt: string
}

interface HistoryItem {
    id: string
    story: Story
    chapter: {
        id: string
        title: string
        slug: string
        order: number
    }
    updatedAt: string
}

interface LibraryClientPageProps {
    userId: string
}

export default function LibraryClientPage({ userId }: LibraryClientPageProps) {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>('bookmarks')
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [activeTab])

    const fetchData = async () => {
        setLoading(true)
        try {
            if (activeTab === 'bookmarks') {
                const res = await fetch('/api/user/bookmarks')
                const data = await res.json()
                if (data.bookmarks) setBookmarks(data.bookmarks)
            } else {
                const res = await fetch('/api/user/history')
                const data = await res.json()
                if (data.history) setHistory(data.history)
            }
        } catch (error) {
            console.error('Failed to fetch data', error)
        } finally {
            setLoading(false)
        }
    }

    const removeBookmark = async (e: React.MouseEvent, storyId: string) => {
        e.preventDefault() // Prevent navigation
        if (!confirm('Remove this story from library?')) return

        try {
            const res = await fetch('/api/user/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storyId })
            })
            if (res.ok) {
                setBookmarks(prev => prev.filter(b => b.story.id !== storyId))
            }
        } catch (error) {
            console.error('Failed to remove bookmark', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col gap-4">
                        <Link href="/">
                            <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors">
                                ← {t('public.story.back_home')}
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="h-8 w-8 text-primary" />
                            My Library
                        </h1>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg w-fit mb-8">
                    <button
                        onClick={() => setActiveTab('bookmarks')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'bookmarks'
                            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        Bookmarks
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'history'
                            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        Reading History
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {activeTab === 'bookmarks' ? (
                            bookmarks.length === 0 ? (
                                <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-gray-500">Your library is empty</p>
                                    <Link href="/">
                                        <Button variant="link" className="mt-2">Discover stories</Button>
                                    </Link>
                                </div>
                            ) : (
                                bookmarks.map((item) => (
                                    <Link key={item.id} href={`/story/${item.story.slug}`} className="group block h-full">
                                        <Card className="h-full hover:shadow-lg transition-all overflow-hidden border-gray-200 dark:border-gray-700">
                                            <div className="relative aspect-[2/1] bg-gray-100 dark:bg-gray-800">
                                                {item.story.coverImage ? (
                                                    <img
                                                        src={item.story.coverImage}
                                                        alt={item.story.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <BookOpen className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                                <button
                                                    onClick={(e) => removeBookmark(e, item.story.id)}
                                                    className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 hover:bg-red-100 dark:hover:bg-red-900 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove from library"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                    {item.story.title}
                                                </h3>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                    <span>{item.story._count.chapters} chapters</span>
                                                    <span className="mx-1">•</span>
                                                    <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )
                        ) : (
                            history.length === 0 ? (
                                <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-gray-500">No reading history yet</p>
                                </div>
                            ) : (
                                history.map((item) => (
                                    <div key={item.id} className="relative group">
                                        <Link href={`/story/${item.story.slug}/${item.chapter.slug}`} className="block h-full">
                                            <Card className="h-full hover:shadow-lg transition-all overflow-hidden border-gray-200 dark:border-gray-700">
                                                <div className="flex p-4 gap-4">
                                                    <div className="w-16 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                                                        {item.story.coverImage ? (
                                                            <img
                                                                src={item.story.coverImage}
                                                                alt={item.story.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <BookOpen className="h-6 w-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                                            {item.story.title}
                                                        </h3>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                            Last read: <span className="font-medium text-primary">Chapter {item.chapter.order}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-500">
                                                            {new Date(item.updatedAt).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                                                    </div>
                                                </div>
                                                <div className="bg-primary/5 px-4 py-2 text-xs text-primary font-medium flex justify-between items-center group-hover:bg-primary/10 transition-colors">
                                                    <span>Continue Reading</span>
                                                    <span>{item.chapter.title}</span>
                                                </div>
                                            </Card>
                                        </Link>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
