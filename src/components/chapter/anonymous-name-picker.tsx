'use client'

import { useState, useEffect } from 'react'
import { ANONYMOUS_NAMES } from '@/lib/constants'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface AnonymousNamePickerProps {
    open: boolean
    onSelect: (name: string) => void
    onCancel: () => void
}

export default function AnonymousNamePicker({ open, onSelect, onCancel }: AnonymousNamePickerProps) {
    const [savedName, setSavedName] = useState<string | null>(null)

    useEffect(() => {
        // Load saved name from localStorage
        const saved = localStorage.getItem('anonymous-name')
        if (saved && ANONYMOUS_NAMES.includes(saved as any)) {
            setSavedName(saved)
        }
    }, [])

    const handleSelectName = (name: string) => {
        localStorage.setItem('anonymous-name', name)
        onSelect(name)
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chọn tên hiển thị</DialogTitle>
                    <DialogDescription>
                        Bạn chưa đăng nhập. Hãy chọn một tên hiển thị ẩn danh để bình luận hoặc đánh giá.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    {savedName && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tên đã lưu:</p>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleSelectName(savedName)}
                            >
                                ✓ {savedName}
                            </Button>
                        </div>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {savedName ? 'Hoặc chọn tên khác:' : 'Chọn tên:'}
                    </p>
                    <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                        {ANONYMOUS_NAMES.filter((name) => name !== savedName).map((name) => (
                            <Button
                                key={name}
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => handleSelectName(name)}
                            >
                                {name}
                            </Button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
