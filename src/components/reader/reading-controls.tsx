import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Type, Settings, AlignJustify, ArrowLeftRight } from 'lucide-react'
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
} from '@/components/ui/dialog'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
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
    const [lineHeight, setLineHeight] = useState(1.8)
    const [marginLevel, setMarginLevel] = useState(0)

    useEffect(() => {
        // Load preferences from localStorage
        const savedFontSize = localStorage.getItem('reading-font-size-v2')
        const savedFontFamily = localStorage.getItem('reading-font-family-v2')
        const savedLineHeight = localStorage.getItem('reading-line-height')
        const savedMarginLevel = localStorage.getItem('reading-margin-level')

        if (savedFontSize) setFontSize(Number(savedFontSize))
        if (savedFontFamily) setFontFamily(savedFontFamily)
        if (savedLineHeight) setLineHeight(Number(savedLineHeight))
        if (savedMarginLevel) setMarginLevel(Number(savedMarginLevel))
    }, [])

    useEffect(() => {
        // Apply preferences
        localStorage.setItem('reading-font-size-v2', fontSize.toString())
        localStorage.setItem('reading-font-family-v2', fontFamily)
        localStorage.setItem('reading-line-height', lineHeight.toString())
        localStorage.setItem('reading-margin-level', marginLevel.toString())

        document.documentElement.style.setProperty('--reading-font-size', `${fontSize}px`)
        document.documentElement.style.setProperty('--reading-line-height', lineHeight.toString())

        // Convert margin level to padding percentage (0 to 30%)
        const marginMap = [0, 5, 12, 20, 30] // Levels 0, 1, 2, 3, 4
        const paddingPercent = marginMap[marginLevel] || 0
        document.documentElement.style.setProperty('--reading-margin-x', `${paddingPercent}%`)

        const selectedFont = FONT_OPTIONS.find(f => f.value === fontFamily)
        if (selectedFont) {
            document.documentElement.style.setProperty('--reading-font-family', selectedFont.family)
        }
    }, [fontSize, fontFamily, lineHeight, marginLevel])

    const increaseFontSize = () => setFontSize(Math.min(fontSize + 2, 32))
    const decreaseFontSize = () => setFontSize(Math.max(fontSize - 2, 12))

    return (
        <>
            {/* Desktop View - Popover */}
            <div className="hidden sm:block">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-80 p-4 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{t('public.reading_controls.title')}</h4>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{t('public.reading_controls.font_size')}</span>
                                <span>{fontSize}px</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={decreaseFontSize} disabled={fontSize <= 12} className="h-8 w-8 p-0">
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center px-2 relative overflow-hidden">
                                    <div className="h-1 bg-gray-300 dark:bg-gray-700 rounded-full w-full relative">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                                            style={{ width: `${Math.min(((fontSize - 12) / 20) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" onClick={increaseFontSize} disabled={fontSize >= 32} className="h-8 w-8 p-0">
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        {/* Font Family */}
                        <div className="space-y-2">
                            <span className="text-xs text-gray-500 block">{t('public.reading_controls.font_family')}</span>
                            <Select value={fontFamily} onValueChange={setFontFamily}>
                                <SelectTrigger className="w-full">
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

                        {/* Line Height */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Line Spacing</span>
                                <span>{lineHeight}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => setLineHeight(Math.max(1.4, Number((lineHeight - 0.2).toFixed(1))))} disabled={lineHeight <= 1.4} className="h-8 w-8 p-0">
                                    <AlignJustify className="h-3 w-3" />
                                </Button>
                                <div className="flex-1 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
                                    {lineHeight === 1.4 ? 'Compact' : lineHeight >= 2.2 ? 'Loose' : 'Normal'}
                                </div>
                                <Button size="sm" variant="outline" onClick={() => setLineHeight(Math.min(2.4, Number((lineHeight + 0.2).toFixed(1))))} disabled={lineHeight >= 2.4} className="h-8 w-8 p-0">
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        {/* Margins */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Side Margins</span>
                                <span>Level {marginLevel}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => setMarginLevel(Math.max(0, marginLevel - 1))} disabled={marginLevel <= 0} className="h-8 w-8 p-0">
                                    <ArrowLeftRight className="h-3 w-3" />
                                </Button>
                                <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center px-2 relative overflow-hidden">
                                    <div className="h-1 bg-gray-300 dark:bg-gray-700 rounded-full w-full relative">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                                            style={{ width: `${(marginLevel / 4) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => setMarginLevel(Math.min(4, marginLevel + 1))} disabled={marginLevel >= 4} className="h-8 w-8 p-0">
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                    </PopoverContent>
                </Popover>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
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

                            {/* Line Height */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Line Spacing</span>
                                    <span className="text-sm text-gray-500">{lineHeight}</span>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg justify-between">
                                    <Button size="icon" variant="ghost" onClick={() => setLineHeight(Math.max(1.4, Number((lineHeight - 0.2).toFixed(1))))}>
                                        <Minus className="h-5 w-5" />
                                    </Button>
                                    <div className="flex-1 px-4 text-center text-sm text-gray-500">
                                        {lineHeight === 1.4 ? 'Compact' : lineHeight >= 2.2 ? 'Loose' : 'Normal'}
                                    </div>
                                    <Button size="icon" variant="ghost" onClick={() => setLineHeight(Math.min(2.4, Number((lineHeight + 0.2).toFixed(1))))}>
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Margins */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Side Margins</span>
                                    <span className="text-sm text-gray-500">Level {marginLevel}</span>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg justify-between">
                                    <Button size="icon" variant="ghost" onClick={() => setMarginLevel(Math.max(0, marginLevel - 1))}>
                                        <Minus className="h-5 w-5" />
                                    </Button>
                                    <div className="flex-1 px-4">
                                        <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded-full w-full relative">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                                                style={{ width: `${(marginLevel / 4) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" onClick={() => setMarginLevel(Math.min(4, marginLevel + 1))}>
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
