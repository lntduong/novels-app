'use client'

import { useTranslation } from '@/components/providers/language-provider'
import Link from 'next/link'
import { Globe } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

interface AdminNavProps {
    user: {
        email: string
        role: string
    }
}

export default function AdminNav({ user }: AdminNavProps) {
    const { t, setLanguage, language } = useTranslation()

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/admin">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                Novels
                            </h1>
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <Link
                                href="/admin"
                                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {t('common.dashboard')}
                            </Link>
                            <Link
                                href="/admin/stories"
                                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {t('common.stories')}
                            </Link>
                            {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') && (
                                <Link
                                    href="/admin/users"
                                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    {t('common.users')}
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Globe className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setLanguage('vi')} className={language === 'vi' ? 'bg-gray-100 dark:bg-gray-700' : ''}>
                                    Tiếng Việt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-gray-100 dark:bg-gray-700' : ''}>
                                    English
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline-block">
                            {user.email} ({t(`roles.${user.role}`)})
                        </span>

                        <form action="/api/auth/logout" method="POST">
                            <button
                                type="submit"
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                                {t('common.logout')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    )
}
