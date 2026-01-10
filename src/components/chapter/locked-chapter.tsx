'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Unlock, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface LockedChapterProps {
    chapterId: string
    onUnlock: (content: string) => void
}

export default function LockedChapter({ chapterId, onUnlock }: LockedChapterProps) {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!password.trim()) return

        setLoading(true)
        try {
            const res = await fetch(`/api/chapters/${chapterId}/unlock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Mật khẩu không đúng')
            }

            toast.success('Mở khóa thành công!')
            onUnlock(data.content)

            // Save to localStorage so user doesn't have to re-enter
            const unlockedChapters = JSON.parse(localStorage.getItem('unlockedChapters') || '{}')
            unlockedChapters[chapterId] = password
            localStorage.setItem('unlockedChapters', JSON.stringify(unlockedChapters))

        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : 'Lỗi mở khóa')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-8 sm:p-12 text-center">

            {/* Background Blur Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden text-justify p-4 filter blur-[3px]">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                    Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                </p>
                <p className="mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
            </div>

            {/* Lock UI */}
            <div className="relative z-10 max-w-md mx-auto">
                <div className="mx-auto w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Chương này bị khóa
                </h3>

                <div className="text-sm text-gray-500 dark:text-gray-400 mb-8 space-y-1">
                    <p>Nội dung chương này được bảo vệ bằng mật khẩu.</p>
                    <p className="flex items-center justify-center gap-1">
                        <Mail className="w-3 h-3" />
                        Vui lòng bình luận email bên dưới để Admin gửi mật khẩu.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        type="password"
                        placeholder="Nhập mật khẩu..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={loading || !password.trim()}>
                        {loading ? 'Đang mở...' : 'Mở khóa'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
