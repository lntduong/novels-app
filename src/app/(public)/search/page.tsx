'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''
    const genreParams = searchParams.get('genres')

    const [stories, setStories] = useState<Story[]>([])
    const [loading, setLoading] = useState(true)
    const [genres, setGenres] = useState<{ id: string, name: string, slug: string }[]>([])
    const [selectedGenres, setSelectedGenres] = useState<string[]>(
        genreParams ? genreParams.split(',') : []
    )

    useEffect(() => {
        // Fetch genres
        fetch('/api/genres')
            .then(res => res.json())
            .then(data => {
                if (data.genres) setGenres(data.genres)
            })
            .catch(err => console.error('Failed to fetch genres', err))
    }, [])

    useEffect(() => {
        // Build URL for API
        const searchStories = async () => {
            // Allow searching if there are filters, even if query is empty
            const hasFilters = selectedGenres.length > 0;
            if ((!query || query.trim().length < 2) && !hasFilters) {
                setStories([])
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (query) params.set('q', query)
                if (selectedGenres.length > 0) params.set('genres', selectedGenres.join(','))

                const res = await fetch(`/api/stories/search?${params.toString()}`)
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
    }, [query, selectedGenres])

    const handleGenreToggle = (slug: string) => {
        const newGenres = selectedGenres.includes(slug)
            ? selectedGenres.filter(g => g !== slug)
            : [...selectedGenres, slug]

        setSelectedGenres(newGenres)

        // Update URL
        const params = new URLSearchParams(searchParams.toString())
        if (newGenres.length > 0) {
            params.set('genres', newGenres.join(','))
        } else {
            params.delete('genres')
        }
        router.push(`/search?${params.toString()}`)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Search Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Home</span>
                            </Button>
                        </Link>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                            Search Stories
                        </h1>
                    </div>
                    <SearchBar />
                </div>
            </div>

            {/* Content Layout */}
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Genres
                        </h3>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {genres.map(genre => (
                                <label key={genre.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-1.5 rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={selectedGenres.includes(genre.slug)}
                                        onChange={() => handleGenreToggle(genre.slug)}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{genre.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : stories.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                No stories found matching your criteria
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Found {stories.length} {stories.length === 1 ? 'story' : 'stories'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {stories.map((story) => (
                                    <Link
                                        key={story.id}
                                        href={`/story/${story.slug}`}
                                        className="group"
                                    >
                                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200 h-full flex flex-col">
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
                                            <div className="p-4 flex flex-col flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                    {story.title}
                                                </h3>
                                                {story.authorName && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        by {story.authorName}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-auto">
                                                    <span>{story._count.chapters} chapters</span>
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
