import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: commentId } = await params

        // Check authentication
        const session = await auth()
        const user = session?.user

        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        // Get comment
        const comment = await prisma.chapterComment.findUnique({
            where: { id: commentId },
        })

        if (!comment) {
            return NextResponse.json(
                { error: 'Comment not found' },
                { status: 404 }
            )
        }

        // Check if user owns the comment or is admin
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
        })

        const isOwner = comment.userId === user.id
        const isAdmin = dbUser?.role === 'ADMIN' || dbUser?.role === 'SUPER_ADMIN'

        if (!isOwner && !isAdmin) {
            return NextResponse.json(
                { error: 'Not authorized to delete this comment' },
                { status: 403 }
            )
        }

        // Delete comment
        await prisma.chapterComment.delete({
            where: { id: commentId },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete comment error:', error)
        return NextResponse.json(
            { error: 'Failed to delete comment' },
            { status: 500 }
        )
    }
}
