
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import LibraryClientPage from '@/components/public/library-client-page'

export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
    const session = await auth()
    const user = session?.user

    if (!user) {
        redirect('/login?next=/library')
    }

    return <LibraryClientPage userId={user.id} />
}
