import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { canManageContent } from '@/lib/permissions'
import { generateSlug } from '@/lib/word-parser'

// PATCH /api/stories/[id] - Update story
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        if (!dbUser || !canManageContent(dbUser.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { title, authorName, description, coverImage, status, genreIds } = body

        const updateData: any = {}
        if (title) {
            updateData.title = title
            updateData.slug = generateSlug(title)
        }
        if (authorName !== undefined) updateData.authorName = authorName || null
        if (description !== undefined) updateData.description = description || null
        if (coverImage !== undefined) updateData.coverImage = coverImage || null
        if (status) updateData.status = status

        if (genreIds && Array.isArray(genreIds)) {
            updateData.genres = {
                set: genreIds.map((id: string) => ({ id }))
            }
        }

        const story = await prisma.story.update({
            where: { id },
            data: updateData,
            include: {
                genres: true
            }
        })

        return NextResponse.json({ story })
    } catch (error) {
        console.error('Error updating story:', error)
        return NextResponse.json(
            { error: 'Failed to update story' },
            { status: 500 }
        )
    }
}

// DELETE /api/stories/[id] - Delete story
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        if (!dbUser || !canManageContent(dbUser.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await prisma.story.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting story:', error)
        return NextResponse.json(
            { error: 'Failed to delete story' },
            { status: 500 }
        )
    }
}
