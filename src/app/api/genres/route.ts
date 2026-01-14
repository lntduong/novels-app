
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { canManageContent } from '@/lib/permissions'

export async function GET() {
    try {
        const genres = await prisma.genre.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { stories: true }
                }
            }
        })
        return NextResponse.json({ genres })
    } catch (error) {
        console.error('Failed to fetch genres:', error)
        return NextResponse.json(
            { error: 'Failed to fetch genres' },
            { status: 500 }
        )
    }
}

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

        // Check if user is admin or super_admin. canManageContent allows Editor too,
        // but for genre management, we might strict it to ADMIN/SUPER_ADMIN.
        // The original code was: userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN'
        // So let's keep it strict.
        if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { name } = body

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        // Generate slug from name
        const slug = name.toLowerCase()
            .normalize('NFD') // Decompose combined characters
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Handle d/D
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
            .replace(/^-+|-+$/g, '') // Trim hyphens

        const genre = await prisma.genre.create({
            data: { name, slug }
        })

        return NextResponse.json({ genre })
    } catch (error) {
        console.error('Failed to create genre:', error)
        return NextResponse.json(
            { error: 'Failed to create genre' },
            { status: 500 }
        )
    }
}
