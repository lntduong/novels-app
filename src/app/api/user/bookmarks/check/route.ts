
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const storyId = searchParams.get('storyId')

        if (!storyId) {
            return NextResponse.json({ error: 'Story ID is required' }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ isBookmarked: false })
        }

        const bookmark = await prisma.bookmark.findUnique({
            where: {
                userId_storyId: {
                    userId: user.id,
                    storyId
                }
            }
        })

        return NextResponse.json({ isBookmarked: !!bookmark })
    } catch (error) {
        console.error('Failed to check bookmark:', error)
        return NextResponse.json({ error: 'Failed to check bookmark' }, { status: 500 })
    }
}
