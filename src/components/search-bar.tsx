'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/providers/language-provider'

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const { t } = useTranslation()

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
        <form onSubmit={handleSearch} className="w-full relative group">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                <Input
                    type="text"
                    placeholder={t('public.home.search_placeholder') || "Tìm kiếm truyện..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 pr-10 py-2 h-10 w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-background focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-full text-sm transition-all shadow-sm"
                />

                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <span className="sr-only">Clear</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                )}
            </div>
        </form>
    )
}
