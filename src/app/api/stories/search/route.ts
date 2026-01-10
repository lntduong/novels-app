import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const q = searchParams.get('q') || ''
        const sort = searchParams.get('sort') || 'date' // 'date' or 'views'

        if (!q || q.trim().length < 2) {
            return NextResponse.json({ stories: [] })
        }

        const stories = await prisma.story.findMany({
            where: {
                status: 'PUBLISHED',
                OR: [
                    { title: { contains: q, mode: 'insensitive' } },
                    { authorName: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                ],
            },
            include: {
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
