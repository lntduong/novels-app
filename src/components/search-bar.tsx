'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('q') || '')

    // Sync query with URL if URL changes externally
    useEffect(() => {
        setQuery(searchParams.get('q') || '')
    }, [searchParams])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())

        if (query.trim()) {
            params.set('q', query.trim())
        } else {
            params.delete('q')
        }

        router.push(`/search?${params.toString()}`)
    }

    const handleClear = () => {
        setQuery('')
        const params = new URLSearchParams(searchParams.toString())
        params.delete('q')
        router.push(`/search?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                    type="text"
                    placeholder="Tìm kiếm truyện theo tên, tác giả hoặc mô tả..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-24 py-6 text-lg"
                />

                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-2"
                        >
                            <span className="sr-only">Clear</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                    <Button type="submit">
                        Tìm kiếm
                    </Button>
                </div>
            </div>
        </form>
    )
}
