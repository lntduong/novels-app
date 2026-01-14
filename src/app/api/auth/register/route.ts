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

        const { origin } = new URL(request.url)

        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        if (data.user) {
            // Check if user exists in Prisma (shouldn't if new, but check ID)
            const existingUser = await prisma.user.findUnique({
                where: { id: data.user.id }
            })

            if (!existingUser) {
                // Create user in Prisma
                await prisma.user.create({
                    data: {
                        id: data.user.id,
                        email: email,
                        role: 'VIEWER' // Default role
                    }
                })
            }
        }

        return NextResponse.json({
            success: true,
            user: data.user,
            requireConfirmation: !data.session
        })

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
