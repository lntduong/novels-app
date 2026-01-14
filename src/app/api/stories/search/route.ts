import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const q = searchParams.get('q') || ''
        const sort = searchParams.get('sort') || 'date' // 'date' or 'views'
        const genres = searchParams.get('genres')?.split(',').filter(Boolean) || []

        const where: any = {
            status: 'PUBLISHED',
        }

        if (q && q.trim().length >= 2) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { authorName: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ]
        }

        if (genres.length > 0) {
            where.genres = {
                some: {
                    slug: { in: genres }
                }
            }
        }

        const stories = await prisma.story.findMany({
            where,
            include: {
                genres: true,
                _count: {
                    select: { chapters: true },
                },
            },
            orderBy: sort === 'views'
                ? { views: 'desc' }
                : { updatedAt: 'desc' },
            take: 50,
        })

        return NextResponse.json({ stories })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { error: 'Failed to search stories' },
            { status: 500 }
        )
    }
}
