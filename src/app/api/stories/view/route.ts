import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { slug } = body

        if (!slug) {
            return NextResponse.json(
                { error: 'Slug is required' },
                { status: 400 }
            )
        }

        // Increment view count
        await prisma.story.update({
            where: { slug },
            data: { views: { increment: 1 } },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('View tracking error:', error)
        // Don't fail the page if view tracking fails
        return NextResponse.json(
            { error: 'Failed to track view' },
            { status: 500 }
        )
    }
}
