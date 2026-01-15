'use client'

import { Users } from 'lucide-react'
import CreateUserDialog from '@/components/admin/create-user-dialog'
import UserActions from '@/components/admin/user-actions'
import { useTranslation } from '@/components/providers/language-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface User {
    id: string
    email: string
    role: string
    createdAt: string | Date
    avatar: string | null
    username: string | null
    nickname: string | null
}

interface UsersClientPageProps {
    users: User[]
    currentUser: User
}

export default function UsersClientPage({ users, currentUser }: UsersClientPageProps) {
    const { t } = useTranslation()

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('admin.users.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {t('admin.users.subtitle')}
                    </p>
                </div>
                <CreateUserDialog />
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('admin.users.table.user')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('admin.users.table.role')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('admin.users.table.created')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('admin.users.table.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((userItem) => (
                                <tr key={userItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={userItem.avatar || ''} alt={userItem.username || userItem.email} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {userItem.nickname?.[0]?.toUpperCase() || userItem.username?.[0]?.toUpperCase() || userItem.email[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {userItem.nickname || userItem.username || userItem.email.split('@')[0]}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {userItem.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${userItem.role === 'SUPER_ADMIN'
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                            : userItem.role === 'ADMIN'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {t(`roles.${userItem.role}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(userItem.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <UserActions user={userItem} currentUserId={currentUser.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">{t('admin.users.no_users')}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
