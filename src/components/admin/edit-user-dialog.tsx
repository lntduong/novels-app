'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/providers/language-provider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface User {
    id: string
    email: string
    username?: string | null
    nickname?: string | null
    birthDate?: string | Date | null
    role: string
}

interface EditUserDialogProps {
    user: User
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
    const router = useRouter()
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Initialize form data
    const [formData, setFormData] = useState({
        username: '',
        nickname: '',
        birthDate: '',
        password: '',
        role: 'VIEWER',
    })

    // Reset/Populate form when user changes or dialog opens
    useEffect(() => {
        if (open && user) {
            let birthDateStr = ''
            if (user.birthDate) {
                const date = new Date(user.birthDate)
                if (!isNaN(date.getTime())) {
                    birthDateStr = date.toISOString().split('T')[0]
                }
            }

            setFormData({
                username: user.username || '',
                nickname: user.nickname || '',
                birthDate: birthDateStr,
                password: '', // New password to reset
                role: user.role,
            })
        }
    }, [open, user])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to update user')
            }

            onOpenChange(false)
            setFormData(prev => ({ ...prev, password: '' })) // Clear password
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('admin.users.edit_dialog_title') || 'Edit User'}</DialogTitle>
                    <DialogDescription>
                        Update details for {user.email}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="edit-username">{t('common.username')}</Label>
                        <Input
                            id="edit-username"
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="username"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-nickname">{t('common.nickname')}</Label>
                        <Input
                            id="edit-nickname"
                            type="text"
                            value={formData.nickname}
                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                            placeholder="Nickname"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-birthDate">{t('common.birthDate')}</Label>
                        <Input
                            id="edit-birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-role">{t('admin.users.role')} *</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => setFormData({ ...formData, role: value })}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="VIEWER">{t('roles.VIEWER')}</SelectItem>
                                <SelectItem value="EDITOR">{t('roles.EDITOR')}</SelectItem>
                                <SelectItem value="ADMIN">{t('roles.ADMIN')}</SelectItem>
                                <SelectItem value="SUPER_ADMIN">{t('roles.SUPER_ADMIN')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <Label htmlFor="edit-password" className="text-orange-600 dark:text-orange-400">
                            {t('common.password')} ({t('common.actions')}: Reset)
                        </Label>
                        <Input
                            id="edit-password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Leave empty to keep current password"
                            minLength={6}
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500">Only fill this if you want to change the user's password.</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? t('common.saving') : t('common.save')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
