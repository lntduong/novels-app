'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { useTranslation } from '@/components/providers/language-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const { t, language, setLanguage } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [errorMessage, dispatch] = useFormState(authenticate, undefined)

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-300/20 dark:bg-orange-900/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl -z-10" />

            {/* Language & Theme Toggles */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                <ThemeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                            <Globe className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLanguage('vi')} className={language === 'vi' ? 'bg-orange-50 dark:bg-gray-700' : ''}>
                            Tiếng Việt
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-orange-50 dark:bg-gray-700' : ''}>
                            English
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Brand Header */}
            <div className="mb-8 text-center z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Link href="/" className="inline-block group">
                    <span className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm group-hover:from-orange-600 group-hover:to-amber-600 transition-all duration-300">
                        vnnovely
                    </span>
                </Link>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium tracking-wide">
                    {t('common.slogan', { defaultValue: 'Explore the world of novels' })}
                </p>
            </div>

            {/* Login Card */}
            <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 animate-in zoom-in-95 duration-500">
                <CardHeader className="space-y-1 pb-6 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">{t('auth.login.title')}</CardTitle>
                    <CardDescription className="text-base">
                        {t('auth.login.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form action={dispatch} className="space-y-4">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="email" className="text-sm font-medium ml-1">{t('auth.login.email_label')}</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                required
                                className="h-11 bg-white/50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-700 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2 text-left">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-sm font-medium ml-1">{t('auth.login.password_label')}</Label>
                                <Link href="/forgot-password" className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:underline">
                                    {t('auth.login.forgot_password', { defaultValue: 'Forgot password?' })}
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                                className="h-11 bg-white/50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-700 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>

                        {errorMessage && (
                            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-lg flex items-center gap-2 animate-in shake">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                                {errorMessage}
                            </div>
                        )}

                        <div className="pt-2">
                            <LoginButton t={t} />
                        </div>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 backdrop-blur-xl">
                                    {t('auth.login.or')}
                                </span>
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            {t('auth.login.no_account')}
                            <Link href="/register" className="ml-1 text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-semibold hover:underline transition-colors">
                                {t('auth.login.register_link')}
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Simple Footer */}
            <div className="absolute bottom-4 text-xs text-gray-400 dark:text-gray-600 text-center">
                &copy; {new Date().getFullYear()} vnnovely. All rights reserved.
            </div>
        </div>
    )
}

function LoginButton({ t }: { t: any }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold h-11 rounded-lg shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:scale-[1.02]" disabled={pending}>
            {pending ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('auth.login.loading')}
                </div>
            ) : t('auth.login.button')}
        </Button>
    )
}
