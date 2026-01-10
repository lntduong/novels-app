import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Sign in with email and password
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            )
        }

        // Verify user exists in database
        const user = await prisma.user.findUnique({
            where: { id: data.user.id },
        })

        if (!user) {
            // Sign out if user doesn't exist in database
            await supabase.auth.signOut()
            return NextResponse.json(
                { error: 'User not found in database' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
