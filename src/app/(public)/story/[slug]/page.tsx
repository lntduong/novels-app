import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StoryClientPage from '@/components/public/story-client-page'

import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const story = await prisma.story.findUnique({
        where: { slug },
        select: { title: true, description: true, coverImage: true, authorName: true }
    })

    if (!story) {
        return {
            title: 'Story Not Found',
        }
    }

    const images = story.coverImage ? [story.coverImage] : []

    return {
        title: story.title,
        description: story.description || undefined,
        openGraph: {
            title: story.title,
            description: story.description || undefined,
            type: 'book',
            authors: story.authorName ? [story.authorName] : undefined,
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title: story.title,
            description: story.description || undefined,
            images,
        },
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

    // structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: story.title,
        description: story.description,
        author: {
            '@type': 'Person',
            name: story.authorName || 'Unknown',
        },
        image: story.coverImage,
        datePublished: story.createdAt.toISOString(),
        dateModified: story.updatedAt.toISOString(),
        genre: story.genres.map(g => g.name),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <StoryClientPage story={serializedStory} />
        </>
    )
}
