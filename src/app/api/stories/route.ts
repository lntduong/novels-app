import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { canManageContent } from '@/lib/permissions'
import { generateSlug } from '@/lib/word-parser'

// GET /api/stories - List all stories
export async function GET() {
    try {
        const stories = await prisma.story.findMany({
            include: {
                author: {
                    select: { email: true, role: true },
                },
                _count: {
                    select: { chapters: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        })

        return NextResponse.json({ stories })
    } catch (error) {
        console.error('Error fetching stories:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stories' },
            { status: 500 }
        )
    }
}

// POST /api/stories - Create new story
export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
        })

        if (!dbUser || !canManageContent(dbUser.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { title, authorName, description, coverImage, status } = body

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            )
        }

        const slug = generateSlug(title)

        const story = await prisma.story.create({
            data: {
                title,
                authorName: authorName || null,
                slug,
                description: description || null,
                coverImage: coverImage || null,
                status: status || 'DRAFT',
                authorId: user.id,
            },
        })

        return NextResponse.json({ story }, { status: 201 })
    } catch (error) {
        console.error('Error creating story:', error)
        return NextResponse.json(
            { error: 'Failed to create story' },
            { status: 500 }
        )
    }
}
