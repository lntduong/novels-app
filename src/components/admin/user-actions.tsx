'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/providers/language-provider'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreVertical, Trash2 } from 'lucide-react'

interface User {
    id: string
    email: string
    role: string
}

export default function UserActions({ user, currentUserId }: { user: User; currentUserId: string }) {
    const router = useRouter()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        setDeleting(true)

        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to delete user')
            }

            router.refresh()
            setDeleteDialogOpen(false)
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Xóa người dùng thất bại')
        } finally {
            setDeleting(false)
        }
    }

    const isCurrentUser = user.id === currentUserId

    const { t } = useTranslation()

    // ...

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={isCurrentUser}
                        className="text-red-600 dark:text-red-400"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('common.delete')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('admin.users.delete_confirm_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('admin.users.delete_confirm_desc', { email: user.email })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleting ? t('common.deleting') : t('common.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
