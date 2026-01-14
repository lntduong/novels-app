
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LibraryClientPage from '@/components/public/library-client-page'

export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?next=/library')
    }

    return <LibraryClientPage userId={user.id} />
}
