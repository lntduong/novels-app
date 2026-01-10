import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { canManageUsers } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import { Users } from 'lucide-react'
import CreateUserDialog from '@/components/admin/create-user-dialog'
import UserActions from '@/components/admin/user-actions'
import UsersClientPage from '@/components/admin/users-client-page'

export default async function UsersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
    })

    if (!currentUser || !canManageUsers(currentUser.role)) {
        redirect('/admin')
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
    })

    const serializedUsers = users.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
    }))

    const serializedCurrentUser = {
        ...currentUser,
        createdAt: currentUser.createdAt.toISOString(),
    }

    return <UsersClientPage users={serializedUsers} currentUser={serializedCurrentUser} />
}
