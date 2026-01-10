'use client'

import Link from 'next/link'
import { BookOpen, FileText, Users, Plus, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/components/providers/language-provider'

interface DashboardClientPageProps {
    storiesCount: number
    chaptersCount: number
    usersCount: number
}

export default function DashboardClientPage({
    storiesCount,
    chaptersCount,
    usersCount,
}: DashboardClientPageProps) {
    const { t } = useTranslation()

    const stats = [
        {
            name: t('admin.stats.total_stories'),
            value: storiesCount,
            icon: BookOpen,
            color: 'orange',
            href: '/admin/stories',
        },
        {
            name: t('admin.stats.total_chapters'),
            value: chaptersCount,
            icon: FileText,
            color: 'blue',
            href: '/admin/stories',
        },
        {
            name: t('admin.stats.total_users'),
            value: usersCount,
            icon: Users,
            color: 'purple',
            href: '/admin/users',
        },
    ]

    const quickActions = [
        {
            title: t('admin.stories.new_button'),
            description: t('admin.stories.create_first'),
            icon: Plus,
            href: '/admin/stories/new',
        },
        {
            title: t('admin.stories.title'),
            description: t('admin.stories.subtitle'),
            icon: BookOpen,
            href: '/admin/stories',
        },
        {
            title: t('admin.users.title'),
            description: t('admin.users.subtitle'),
            icon: Users,
            href: '/admin/users',
        },
    ]

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('common.dashboard')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {t('admin.welcome')}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Link key={index} href={stat.href}>
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200 cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        {stat.name}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className="stat-icon p-3 rounded-xl bg-primary/10 transition-all duration-200">
                                    <stat.icon className="w-6 h-6 text-primary transition-colors duration-200" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.quick_actions')}
                    </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                        <Link key={index} href={action.href} className="h-full">
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-orange-50 dark:hover:bg-gray-700 transition-all duration-200 group h-full">
                                <div className="flex items-start gap-3 h-full">
                                    <div className="action-icon-wrapper p-2 rounded-lg bg-primary/10 transition-all duration-200">
                                        <action.icon className="action-icon w-5 h-5 text-primary transition-colors duration-200" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {action.description}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
