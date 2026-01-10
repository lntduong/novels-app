import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { canViewDashboard } from '@/lib/permissions'
import AdminNav from '@/components/admin/admin-nav'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
    })

    if (!dbUser || !canViewDashboard(dbUser.role)) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <AdminNav user={dbUser} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}
