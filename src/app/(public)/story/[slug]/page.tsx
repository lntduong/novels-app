import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StoryClientPage from '@/components/public/story-client-page'

import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const story = await prisma.story.findUnique({
        where: { slug },
        select: { title: true, description: true }
    })

    if (!story) {
        return {
            title: 'Story Not Found',
        }
    }

    return {
        title: story.title,
        description: story.description || undefined,
    }
}

export default async function StoryDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const story = await prisma.story.findUnique({
        where: { slug, status: 'PUBLISHED' },
        include: {
            chapters: {
                orderBy: { order: 'asc' },
            },
            author: true,
            genres: true,
        },
    })

    if (!story) {
        notFound()
    }

    // Serialize dates for Client Component
    const serializedStory = {
        ...story,
        chapters: story.chapters.map(ch => ({
            ...ch,
            createdAt: ch.createdAt.toISOString(),
            updatedAt: ch.updatedAt.toISOString(),
        })),
        createdAt: story.createdAt.toISOString(),
        updatedAt: story.updatedAt.toISOString(),
    }

    return <StoryClientPage story={serializedStory} />
}
