import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { canManageContent } from '@/lib/permissions'
import { generateSlug } from '@/lib/word-parser'

// GET /api/chapters - List chapters for a story
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const storyId = searchParams.get('storyId')

        if (!storyId) {
            return NextResponse.json(
                { error: 'storyId is required' },
                { status: 400 }
            )
        }

        const chapters = await prisma.chapter.findMany({
            where: { storyId },
            orderBy: { order: 'asc' },
        })

        return NextResponse.json({ chapters })
    } catch (error) {
        console.error('Error fetching chapters:', error)
        return NextResponse.json(
            { error: 'Failed to fetch chapters' },
            { status: 500 }
        )
    }
}

// POST /api/chapters - Create new chapter
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
        const { title, content, storyId } = body

        if (!title || !content || !storyId) {
            return NextResponse.json(
                { error: 'Title, content, and storyId are required' },
                { status: 400 }
            )
        }

        // Get the next order number
        const lastChapter = await prisma.chapter.findFirst({
            where: { storyId },
            orderBy: { order: 'desc' },
        })

        const order = lastChapter ? lastChapter.order + 1 : 1

        // Generate unique slug
        let slug = generateSlug(title)
        let counter = 1

        // Check if slug exists, if yes, append number
        while (true) {
            const existing = await prisma.chapter.findFirst({
                where: {
                    storyId,
                    slug: counter === 1 ? slug : `${slug}-${counter}`
                }
            })

            if (!existing) {
                if (counter > 1) {
                    slug = `${slug}-${counter}`
                }
                break
            }
            counter++
        }

        const chapter = await prisma.chapter.create({
            data: {
                title,
                slug,
                content,
                order,
                storyId,
                accessPassword: body.accessPassword || null,
            },
        })

        return NextResponse.json({ chapter }, { status: 201 })
    } catch (error) {
        console.error('Error creating chapter:', error)
        return NextResponse.json(
            { error: 'Failed to create chapter' },
            { status: 500 }
        )
    }
}
