import { prisma } from '@/lib/prisma'
import StoriesClientPage from '@/components/admin/stories-client-page'

export default async function StoriesPage() {
    const stories = await prisma.story.findMany({
        include: {
            author: true,
            _count: {
                select: { chapters: true },
            },
        },
        orderBy: { updatedAt: 'desc' },
    })

    const serializedStories = stories.map(story => ({
        ...story,
        createdAt: story.createdAt.toISOString()
    }))

    return <StoriesClientPage stories={serializedStories} />
}
