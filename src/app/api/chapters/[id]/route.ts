import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { canManageContent } from '@/lib/permissions'
import { generateSlug } from '@/lib/word-parser'

// PATCH /api/chapters/[id] - Update chapter
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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
        const { title, content } = body

        const updateData: any = {}
        if (title) {
            updateData.title = title
            updateData.slug = generateSlug(title)
        }
        if (content) updateData.content = content
        if (body.accessPassword !== undefined) {
            updateData.accessPassword = body.accessPassword || null
        }

        const chapter = await prisma.chapter.update({
            where: { id },
            data: updateData,
        })

        return NextResponse.json({ chapter })
    } catch (error) {
        console.error('Error updating chapter:', error)
        return NextResponse.json(
            { error: 'Failed to update chapter' },
            { status: 500 }
        )
    }
}

// DELETE /api/chapters/[id] - Delete chapter
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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

        await prisma.chapter.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting chapter:', error)
        return NextResponse.json(
            { error: 'Failed to delete chapter' },
            { status: 500 }
        )
    }
}
