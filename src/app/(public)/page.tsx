import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import HomeClientPage from '@/components/public/home-client-page'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
    const [stories, totalViews] = await Promise.all([
        prisma.story.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { updatedAt: 'desc' },
            take: 12,
            include: {
                _count: {
                    select: { chapters: true }
                }
            }
        }),
        prisma.story.aggregate({
            where: { status: 'PUBLISHED' },
            _sum: { views: true }
        })
    ])

    const totalReads = totalViews._sum.views || 0
    const totalStories = stories.length
    const totalChapters = stories.reduce((acc, s) => acc + s._count.chapters, 0)

    const session = await auth()

    return (
        <HomeClientPage
            stories={stories}
            totalReads={totalReads}
            totalStories={totalStories}
            totalChapters={totalChapters}
            user={session?.user}
        />
    )
}
