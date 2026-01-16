'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Globe, User as UserIcon, LogOut, Settings, Search } from 'lucide-react'
import SearchBar from '@/components/search-bar'
import { useTranslation } from '@/components/providers/language-provider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { signOut } from 'next-auth/react'

interface PublicHeaderProps {
    user?: any
}

export default function PublicHeader({ user }: PublicHeaderProps) {
    const { t, language, setLanguage } = useTranslation()

    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo / Brand */}
                <Link href="/" className="flex-shrink-0 group">
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-amber-600 transition-all duration-300">
                        vnnovely
                    </span>
                </Link>

                {/* Search Bar - Centered & Flexible */}
                <div className="flex-1 max-w-md hidden md:block">
                    <SearchBar />
                </div>
                {/* Mobile Search Icon - Visible only on small screens */}
                <div className="md:hidden flex-1 flex justify-end">
                    {/* Simplified mobile search trigger could go here, for now keeping layout clean */}
                </div>


                {/* Navigation Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Mobile Search Trigger could be added here if needed */}

                    <Link href="/library">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300" title={t('common.stories') || 'Library'}>
                            <BookOpen className="h-5 w-5" />
                        </Button>
                    </Link>

                    <ThemeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-200" title="Language">
                                <Globe className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => setLanguage('vi')} className={language === 'vi' ? 'bg-orange-50 dark:bg-gray-800 font-medium' : ''}>
                                Tiếng Việt
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-orange-50 dark:bg-gray-800 font-medium' : ''}>
                                English
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-orange-50 dark:hover:bg-gray-800" title="User Menu">
                                    {user.image ? (
                                        <img src={user.image} alt="User" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-gray-800 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                            <UserIcon className="h-5 w-5" />
                                        </div>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem className="font-semibold" disabled>
                                    {user.email}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <Link href="/profile">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <UserIcon className="w-4 h-4 mr-2" />
                                        {t('common.profile') || 'Profile'}
                                    </DropdownMenuItem>
                                </Link>
                                {user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? (
                                    <Link href="/admin">
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Settings className="w-4 h-4 mr-2" />
                                            {t('common.dashboard')}
                                        </DropdownMenuItem>
                                    </Link>
                                ) : null}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()} className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    {t('common.logout')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200">
                                {t('auth.login.button')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
            {/* Mobile Search Bar - Visible below header on small screens */}
            <div className="md:hidden px-4 pb-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="mt-3">
                    <SearchBar />
                </div>
            </div>
        </header>
    )
}
