
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProfileClientPage from '@/components/profile/profile-client-page'

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) return null

    // Serialize dates
    const serializedUser = {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        birthDate: user.birthDate ? user.birthDate.toISOString() : null,
    }

    return <ProfileClientPage user={serializedUser} />
}
