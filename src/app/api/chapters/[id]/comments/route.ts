import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { isValidAnonymousName } from '@/lib/constants'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: chapterId } = await params
        const body = await request.json()
        const { content, anonymousName } = body

        // Validate content
        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Comment content is required' },
                { status: 400 }
            )
        }

        if (content.length > 500) {
            return NextResponse.json(
                { error: 'Comment must be 500 characters or less' },
                { status: 400 }
            )
        }

        // Check authentication
        const session = await auth()
        const user = session?.user

        let userId: string | null = null
        let finalAnonymousName: string | null = null
        let displayName: string

        if (user) {
            userId = user.id
            displayName = user.email || 'User'
        } else {
            // Anonymous user - validate name
            if (!anonymousName || !isValidAnonymousName(anonymousName)) {
                return NextResponse.json(
                    { error: 'Valid anonymous name required for anonymous users' },
                    { status: 400 }
                )
            }
            finalAnonymousName = anonymousName
            displayName = anonymousName
        }

        // Create comment
        const comment = await prisma.chapterComment.create({
            data: {
                content: content.trim(),
                userId,
                anonymousName: finalAnonymousName,
                chapterId,
            },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json({
            success: true,
            comment: {
                ...comment,
                displayName,
            },
        })
    } catch (error) {
        console.error('Comment error:', error)
        return NextResponse.json(
            { error: 'Failed to post comment' },
            { status: 500 }
        )
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: chapterId } = await params
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        const [comments, total] = await Promise.all([
            prisma.chapterComment.findMany({
                where: { chapterId },
                include: {
                    user: {
                        select: {
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.chapterComment.count({ where: { chapterId } }),
        ])

        // Format comments with display names
        const formattedComments = comments.map((comment) => ({
            ...comment,
            displayName: comment.user?.email || comment.anonymousName || 'Anonymous',
        }))

        return NextResponse.json({
            comments: formattedComments,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error('Get comments error:', error)
        return NextResponse.json(
            { error: 'Failed to get comments' },
            { status: 500 }
        )
    }
}
