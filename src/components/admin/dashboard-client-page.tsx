'use client'

import Link from 'next/link'
import { BookOpen, FileText, Users, Plus, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/components/providers/language-provider'

import TrafficChart from './charts/TrafficChart'
import VisitorMap from './charts/VisitorMap'
import { format } from 'date-fns'

interface DashboardClientPageProps {
    storiesCount: number
    chaptersCount: number
    usersCount: number
    analytics: {
        chartData: { date: string; views: number }[]
        visitorMap: { code: string; count: number }[]
        recentVisitors: {
            ip: string | null
            path: string
            country: string | null
            browser: string | null
            createdAt: Date
        }[]
    }
}

export default function DashboardClientPage({
    storiesCount,
    chaptersCount,
    usersCount,
    analytics,
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
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('common.dashboard')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {t('admin.welcome')}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('admin.analytics.traffic_overview')}
                    </h2>
                    <TrafficChart data={analytics.chartData} />
                </div>

                {/* Visitor Map */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('admin.analytics.visitors_by_country')}
                    </h2>
                    <VisitorMap data={analytics.visitorMap} />
                </div>
            </div>

            {/* Recent Visitors Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.analytics.recent_visitors')}
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">{t('admin.analytics.table.ip')}</th>
                                <th className="px-6 py-3">{t('admin.analytics.table.location')}</th>
                                <th className="px-6 py-3">{t('admin.analytics.table.path')}</th>
                                <th className="px-6 py-3">{t('admin.analytics.table.browser')}</th>
                                <th className="px-6 py-3">{t('admin.analytics.table.time')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {analytics.recentVisitors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">{t('admin.analytics.table.no_data')}</td>
                                </tr>
                            ) : (
                                analytics.recentVisitors.map((visitor, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs">{visitor.ip || 'N/A'}</td>
                                        <td className="px-6 py-4">{visitor.country || 'Unknown'}</td>
                                        <td className="px-6 py-4 truncate max-w-[200px]">{visitor.path}</td>
                                        <td className="px-6 py-4">{visitor.browser || 'Unknown'}</td>
                                        <td className="px-6 py-4">{format(new Date(visitor.createdAt), 'MMM dd, HH:mm')}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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
