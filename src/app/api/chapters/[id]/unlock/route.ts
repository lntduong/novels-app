import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { password } = await request.json()

        if (!password) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            )
        }

        const chapter = await prisma.chapter.findUnique({
            where: { id },
            select: {
                id: true,
                content: true,
                accessPassword: true,
            },
        })

        if (!chapter) {
            return NextResponse.json(
                { error: 'Chapter not found' },
                { status: 404 }
            )
        }

        if (!chapter.accessPassword) {
            // If no password set, just return content
            return NextResponse.json({ content: chapter.content })
        }

        if (chapter.accessPassword !== password) {
            return NextResponse.json(
                { error: 'Incorrect password' },
                { status: 403 }
            )
        }

        // Password correct, return content
        return NextResponse.json({ content: chapter.content })
    } catch (error) {
        console.error('Unlock chapter error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
