import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// PATCH /api/admin/users/[id] - Update user details
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

        if (!dbUser || dbUser.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { role, nickname, username, birthDate, password } = body

        const updateData: any = {}
        if (role) updateData.role = role
        if (nickname !== undefined) updateData.nickname = nickname
        if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null

        if (username) {
            // Check uniqueness if username is changing
            const existingUser = await prisma.user.findUnique({
                where: { username }
            })
            if (existingUser && existingUser.id !== id) {
                return NextResponse.json(
                    { error: 'Username already taken' },
                    { status: 400 }
                )
            }
            updateData.username = username
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            updateData.password = hashedPassword
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        })

        const { password: _, ...userWithoutPassword } = updatedUser
        return NextResponse.json({ user: userWithoutPassword })
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        )
    }
}

// DELETE /api/admin/users/[id] - Delete user
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

        if (!dbUser || dbUser.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Don't allow deleting yourself
        if (id === session.user.id) {
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 400 }
            )
        }

        // Delete from database
        await prisma.user.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        )
    }
}


