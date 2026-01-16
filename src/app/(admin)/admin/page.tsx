import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import DashboardClientPage from '@/components/admin/dashboard-client-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Admin',
    description: 'Admin Dashboard',
}

import { getAnalyticsData } from '@/lib/analytics'

export default async function AdminDashboard() {
    const session = await auth()
    // User check handled in layout

    const [storiesCount, chaptersCount, usersCount, analytics] = await Promise.all([
        prisma.story.count(),
        prisma.chapter.count(),
        prisma.user.count(),
        getAnalyticsData(),
    ])

    return (
        <DashboardClientPage
            storiesCount={storiesCount}
            chaptersCount={chaptersCount}
            usersCount={usersCount}
            analytics={analytics}
        />
    )
}
