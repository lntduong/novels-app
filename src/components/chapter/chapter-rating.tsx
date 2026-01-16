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

            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => !loading && handleRatingClick(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            disabled={loading}
                            className="p-1 transition-all hover:scale-110 focus:outline-none disabled:opacity-50 group"
                        >
                            <Star
                                className={`w-8 h-8 transition-colors ${star <= (hoveredStar || userRating || 0)
                                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                                        : 'text-gray-300 dark:text-gray-600 fill-transparent'
                                    }`}
                                strokeWidth={1.5}
                            />
                        </button>
                    ))}
                </div>

                <div className="h-6 text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200">
                    {hoveredStar ? (
                        <span className="text-primary">
                            {hoveredStar === 1 && 'Tệ'}
                            {hoveredStar === 2 && 'Bình thường'}
                            {hoveredStar === 3 && 'Khá'}
                            {hoveredStar === 4 && 'Hay'}
                            {hoveredStar === 5 && 'Tuyệt vời'}
                        </span>
                    ) : (
                        userRating ? 'Cảm ơn bạn đã đánh giá!' : 'Chọn sao để đánh giá'
                    )}
                </div>

                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Điểm trung bình: <span className="font-semibold text-gray-700 dark:text-gray-200">{average.toFixed(1)}</span> ({count} đánh giá)
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
