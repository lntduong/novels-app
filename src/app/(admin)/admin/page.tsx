import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import DashboardClientPage from '@/components/admin/dashboard-client-page'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Admin',
    description: 'Admin Dashboard',
}

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Note: In a real app we might want to check roles here too, 
    // although layout/middleware should handle basic protection.

    const [storiesCount, chaptersCount, usersCount] = await Promise.all([
        prisma.story.count(),
        prisma.chapter.count(),
        prisma.user.count(),
    ])

    return (
        <DashboardClientPage
            storiesCount={storiesCount}
            chaptersCount={chaptersCount}
            usersCount={usersCount}
        />
    )
}
