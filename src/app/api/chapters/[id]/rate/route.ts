import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { isValidAnonymousName } from '@/lib/constants'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: chapterId } = await params
        const body = await request.json()
        const { rating, anonymousName } = body

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            )
        }

        // Check authentication
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        let userId: string | null = null
        let finalAnonymousName: string | null = null

        if (user) {
            userId = user.id
        } else {
            // Anonymous user - validate name
            if (!anonymousName || !isValidAnonymousName(anonymousName)) {
                return NextResponse.json(
                    { error: 'Valid anonymous name required for anonymous users' },
                    { status: 400 }
                )
            }
            finalAnonymousName = anonymousName
        }

        // Upsert rating
        const ratingData = userId
            ? await prisma.chapterRating.upsert({
                where: {
                    userId_chapterId: {
                        userId,
                        chapterId,
                    },
                },
                update: { rating },
                create: {
                    rating,
                    userId,
                    chapterId,
                },
            })
            : await prisma.chapterRating.create({
                data: {
                    rating,
                    anonymousName: finalAnonymousName,
                    chapterId,
                },
            })

        // Calculate new average
        const aggregate = await prisma.chapterRating.aggregate({
            where: { chapterId },
            _avg: { rating: true },
            _count: true,
        })

        return NextResponse.json({
            success: true,
            rating: ratingData,
            average: aggregate._avg.rating || 0,
            count: aggregate._count,
        })
    } catch (error) {
        console.error('Rating error:', error)
        return NextResponse.json(
            { error: 'Failed to submit rating' },
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

        const aggregate = await prisma.chapterRating.aggregate({
            where: { chapterId },
            _avg: { rating: true },
            _count: true,
        })

        // Check if current user has rated
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        let userRating: number | null = null

        if (user) {
            const rating = await prisma.chapterRating.findUnique({
                where: {
                    userId_chapterId: {
                        userId: user.id,
                        chapterId,
                    },
                },
            })
            userRating = rating?.rating || null
        }

        return NextResponse.json({
            average: aggregate._avg.rating || 0,
            count: aggregate._count,
            userRating,
        })
    } catch (error) {
        console.error('Get ratings error:', error)
        return NextResponse.json(
            { error: 'Failed to get ratings' },
            { status: 500 }
        )
    }
}
