import { prisma } from '@/lib/prisma'
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://novels.yangyu.win'

    try {
        // Get all published stories
        const stories = await prisma.story.findMany({
            where: { status: 'PUBLISHED' },
            select: {
                slug: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: 'desc' },
            take: 1000,
        })

        const storyUrls = stories.map((story) => ({
            url: `${baseUrl}/story/${story.slug}`,
            lastModified: story.updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.8,
        }))

        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'always',
                priority: 1,
            },
            {
                url: `${baseUrl}/library`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.8,
            },
            ...storyUrls,
        ]
    } catch (error) {
        console.error('Sitemap generation failed (likely build time DB access issue):', error)
        // Return static structure if DB fails (e.g. during build)
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'always',
                priority: 1,
            },
        ]
    }
}
