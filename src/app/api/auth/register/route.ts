import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const { email, password, username } = await request.json()

        if (!email || !password || !username) {
            return NextResponse.json(
                { error: 'Email, username, and password are required' },
                { status: 400 }
            )
        }

        // Check if user exists (email or username)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or username already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                role: 'VIEWER'
            }
        })

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({
            success: true,
            user: userWithoutPassword,
        })

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
