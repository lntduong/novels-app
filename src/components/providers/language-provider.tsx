'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import vi from '@/locales/vi.json'
import en from '@/locales/en.json'

type LocaleData = typeof vi

const locales: Record<string, LocaleData> = { vi, en }

type LanguageContextType = {
    language: string
    setLanguage: (lang: string) => void
    t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState('vi')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const savedLang = localStorage.getItem('app-language')
        if (savedLang && locales[savedLang]) {
            setLanguage(savedLang)
        }
        setMounted(true)
    }, [])

    const handleSetLanguage = (lang: string) => {
        if (locales[lang]) {
            setLanguage(lang)
            localStorage.setItem('app-language', lang)
        }
    }

    const t = (key: string, params?: Record<string, string | number>): string => {
        const keys = key.split('.')
        let value: any = locales[language]

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k as keyof typeof value]
            } else {
                return key // Return key if not found
            }
        }

        if (typeof value !== 'string') {
            return key
        }

        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                value = value.replace(`{${paramKey}}`, String(paramValue))
            })
        }

        return value
    }

    // Only render children when mounted to avoid hydration mismatch
    // Or render with default but might cause flicker. To be safe for now we render children.
    // Actually, for immediate client interactivity, we need to handle hydration.
    // If we return null until mounted, SEO is hurt.
    // A better approach for this simple app: render with default 'vi' but update in useEffect.
    // The flicker is acceptable or we can use next-themes approach.
    // For now, let's just return children. If language changes, it re-renders.

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useTranslation = () => {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider')
    }
    return context
}
