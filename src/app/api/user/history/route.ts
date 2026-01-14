
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// GET /api/user/history - List reading history
export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const storyId = searchParams.get('storyId')

        const where: any = { userId: user.id }
        if (storyId) {
            where.storyId = storyId
        }

        const history = await prisma.readingHistory.findMany({
            where,
            include: {
                story: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        coverImage: true,
                        authorName: true,
                        status: true,
                        updatedAt: true,
                        _count: {
                            select: { chapters: true }
                        }
                    }
                },
                chapter: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        order: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' },
            take: storyId ? 1 : 20
        })

        return NextResponse.json({ history })
    } catch (error) {
        console.error('Failed to fetch history:', error)
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
    }
}

// POST /api/user/history - Update reading progress
export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { storyId, chapterId } = await request.json()
        if (!storyId || !chapterId) {
            return NextResponse.json({ error: 'Story ID and Chapter ID are required' }, { status: 400 })
        }

        // Upsert history: Create if new, Update if exists
        const history = await prisma.readingHistory.upsert({
            where: {
                userId_storyId: {
                    userId: user.id,
                    storyId
                }
            },
            update: {
                chapterId,
                updatedAt: new Date()
            },
            create: {
                userId: user.id,
                storyId,
                chapterId
            }
        })

        return NextResponse.json({ history })
    } catch (error) {
        console.error('Failed to update history:', error)
        return NextResponse.json({ error: 'Failed to update history' }, { status: 500 })
    }
}
