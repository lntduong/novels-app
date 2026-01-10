'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import AnonymousNamePicker from './anonymous-name-picker'

interface ChapterRatingProps {
    chapterId: string
}

export default function ChapterRating({ chapterId }: ChapterRatingProps) {
    const [average, setAverage] = useState(0)
    const [count, setCount] = useState(0)
    const [userRating, setUserRating] = useState<number | null>(null)
    const [hoveredStar, setHoveredStar] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showNamePicker, setShowNamePicker] = useState(false)
    const [pendingRating, setPendingRating] = useState<number | null>(null)

    useEffect(() => {
        fetchRatings()
    }, [chapterId])

    const fetchRatings = async () => {
        try {
            const res = await fetch(`/api/chapters/${chapterId}/rate`)
            const data = await res.json()
            setAverage(data.average)
            setCount(data.count)
            setUserRating(data.userRating)
        } catch (error) {
            console.error('Failed to fetch ratings:', error)
        }
    }

    const handleRatingClick = async (rating: number) => {
        setPendingRating(rating)

        // Check if anonymous name is needed
        const savedName = localStorage.getItem('anonymous-name')

        // Try to get user auth status
        const hasAuth = document.cookie.includes('sb-')

        if (!hasAuth && !savedName) {
            setShowNamePicker(true)
            return
        }

        await submitRating(rating, savedName)
    }

    const submitRating = async (rating: number, anonymousName: string | null) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/chapters/${chapterId}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, anonymousName }),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to submit rating')
            }

            const data = await res.json()
            setAverage(data.average)
            setCount(data.count)
            setUserRating(rating)
            toast.success('Đánh giá thành công!')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể đánh giá')
        } finally {
            setLoading(false)
            setPendingRating(null)
        }
    }

    const handleNameSelected = (name: string) => {
        setShowNamePicker(false)
        if (pendingRating) {
            submitRating(pendingRating, name)
        }
    }

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Đánh giá chương này
            </h3>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => !loading && handleRatingClick(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            disabled={loading}
                            className="transition-transform hover:scale-110 disabled:opacity-50"
                        >
                            <Star
                                className={`w-5 h-5 ${star <= (hoveredStar || userRating || 0)
                                        ? 'fill-primary text-primary'
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {average.toFixed(1)}
                    </span>{' '}
                    ({count} đánh giá)
                </div>
            </div>

            <AnonymousNamePicker
                open={showNamePicker}
                onSelect={handleNameSelected}
                onCancel={() => {
                    setShowNamePicker(false)
                    setPendingRating(null)
                }}
            />
        </div>
    )
}
