
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/user/bookmarks - List user's bookmarks
export async function GET(request: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: session.user.id },
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
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ bookmarks })
    } catch (error) {
        console.error('Failed to fetch bookmarks:', error)
        return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
    }
}

// POST /api/user/bookmarks - Toggle bookmark
export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { storyId } = await request.json()
        if (!storyId) {
            return NextResponse.json({ error: 'Story ID is required' }, { status: 400 })
        }

        // Check if exists
        const existing = await prisma.bookmark.findUnique({
            where: {
                userId_storyId: {
                    userId: session.user.id,
                    storyId
                }
            }
        })

        if (existing) {
            // Remove
            await prisma.bookmark.delete({
                where: { id: existing.id }
            })
            return NextResponse.json({ isBookmarked: false })
        } else {
            // Add
            await prisma.bookmark.create({
                data: {
                    userId: session.user.id,
                    storyId
                }
            })
            return NextResponse.json({ isBookmarked: true })
        }
    } catch (error) {
        console.error('Failed to toggle bookmark:', error)
        return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 })
    }
}
