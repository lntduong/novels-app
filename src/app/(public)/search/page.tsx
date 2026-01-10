'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Loader2, Home } from 'lucide-react'
import SearchBar from '@/components/search-bar'
import { Button } from '@/components/ui/button'

interface Story {
    id: string
    title: string
    slug: string
    authorName: string | null
    description: string | null
    coverImage: string | null
    views: number
    _count: {
        chapters: number
    }
}

function SearchContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''
    const [stories, setStories] = useState<Story[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const searchStories = async () => {
            if (!query || query.trim().length < 2) {
                setStories([])
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const res = await fetch(`/api/stories/search?q=${encodeURIComponent(query)}`)
                const data = await res.json()
                setStories(data.stories || [])
            } catch (error) {
                console.error('Search error:', error)
                setStories([])
            } finally {
                setLoading(false)
            }
        }

        searchStories()
    }, [query])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Search Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Home</span>
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Search Stories
                        </h1>
                    </div>
                    <SearchBar />
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : !query || query.trim().length < 2 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Enter at least 2 characters to search
                        </p>
                    </div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            No stories found for "{query}"
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Found {stories.length} {stories.length === 1 ? 'story' : 'stories'} for "{query}"
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {stories.map((story) => (
                                <Link
                                    key={story.id}
                                    href={`/story/${story.slug}`}
                                    className="group"
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200">
                                        <div className="aspect-[2/3] bg-gradient-to-br from-orange-100 to-orange-200 dark:from-gray-700 dark:to-gray-600 relative overflow-hidden">
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
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                {story.title}
                                            </h3>
                                            {story.authorName && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    by {story.authorName}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                <span>{story._count.chapters} chapters</span>
                                                <span>•</span>
                                                <span>{story.views.toLocaleString()} reads</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
}
