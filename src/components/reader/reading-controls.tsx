'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Type, Settings, X } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog'
import { useTranslation } from '@/components/providers/language-provider'

const FONT_OPTIONS = [
    { value: 'georgia', label: 'Georgia', family: 'Georgia, serif' },
    { value: 'be-vietnam', label: 'Be Vietnam Pro', family: '"Be Vietnam Pro", sans-serif' },
    { value: 'nunito', label: 'Nunito', family: '"Nunito", sans-serif' },
    { value: 'merriweather', label: 'Merriweather', family: '"Merriweather", serif' },
    { value: 'lora', label: 'Lora', family: '"Lora", serif' },
    { value: 'system', label: 'System Default', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
]

export default function ReadingControls() {
    const { t } = useTranslation()
    const [fontSize, setFontSize] = useState(18)
    const [fontFamily, setFontFamily] = useState('be-vietnam')

    useEffect(() => {
        // Load preferences from localStorage
        const savedFontSize = localStorage.getItem('reading-font-size-v2')
        const savedFontFamily = localStorage.getItem('reading-font-family-v2')

        if (savedFontSize) setFontSize(Number(savedFontSize))
        if (savedFontFamily) setFontFamily(savedFontFamily)
    }, [])

    useEffect(() => {
        // Apply preferences
        localStorage.setItem('reading-font-size-v2', fontSize.toString())
        localStorage.setItem('reading-font-family-v2', fontFamily)

        document.documentElement.style.setProperty('--reading-font-size', `${fontSize}px`)

        const selectedFont = FONT_OPTIONS.find(f => f.value === fontFamily)
        if (selectedFont) {
            document.documentElement.style.setProperty('--reading-font-family', selectedFont.family)
        }
    }, [fontSize, fontFamily])

    const increaseFontSize = () => setFontSize(Math.min(fontSize + 2, 32))
    const decreaseFontSize = () => setFontSize(Math.max(fontSize - 2, 12))

    return (
        <>
            {/* Desktop View */}
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                {/* Font size controls */}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 rounded-md p-1">
                    <span className="text-xs font-medium px-2 text-gray-600 dark:text-gray-400">{t('public.reading_controls.font_size')}:</span>
                    <Button size="icon" variant="ghost" onClick={decreaseFontSize} className="h-8 w-8">
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium px-2 min-w-[3rem] text-center">{fontSize}px</span>
                    <Button size="icon" variant="ghost" onClick={increaseFontSize} className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* Font family selector */}
                <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {FONT_OPTIONS.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                    {font.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>

            {/* Mobile View */}
            <div className="sm:hidden">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] max-w-sm rounded-xl">
                        <DialogHeader>
                            <DialogTitle className="text-center pb-2 border-b border-gray-100 dark:border-gray-800">{t('public.reading_controls.title')}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">

                            {/* Font Size */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{t('public.reading_controls.font_size')}</span>
                                    <span className="text-sm text-gray-500">{fontSize}px</span>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg justify-between">
                                    <Button size="icon" variant="ghost" onClick={decreaseFontSize}>
                                        <Minus className="h-5 w-5" />
                                    </Button>
                                    <div className="flex-1 px-4">
                                        {/* Visual bar graph representation or just spaces */}
                                        <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded-full w-full relative">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                                                style={{ width: `${Math.min(((fontSize - 12) / 20) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" onClick={increaseFontSize}>
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Font Family */}
                            <div className="space-y-3">
                                <span className="font-medium">{t('public.reading_controls.font_family')}</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {FONT_OPTIONS.map((font) => (
                                        <Button
                                            key={font.value}
                                            variant={fontFamily === font.value ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setFontFamily(font.value)}
                                            className={fontFamily === font.value ? 'border-primary' : ''}
                                        >
                                            {font.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}
