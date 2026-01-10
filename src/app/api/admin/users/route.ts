import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users - List all users (SUPER_ADMIN only)
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
        })

        if (!dbUser || dbUser.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}

// POST /api/admin/users - Create new user
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

        if (!dbUser || dbUser.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { email, password, role } = body

        if (!email || !password || !role) {
            return NextResponse.json(
                { error: 'Email, password, and role are required' },
                { status: 400 }
            )
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        })

        if (authError) {
            console.error('Supabase auth error:', authError)
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            )
        }

        // Create user in database
        const newUser = await prisma.user.create({
            data: {
                id: authData.user.id,
                email,
                role,
            },
        })

        return NextResponse.json({ user: newUser }, { status: 201 })
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        )
    }
}
