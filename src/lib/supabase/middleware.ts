import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    if (
        !user &&
        (request.nextUrl.pathname.startsWith('/admin') ||
            request.nextUrl.pathname.startsWith('/api/admin'))
    ) {
        // No user, redirect to login
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely.

    // Set user info in headers for API routes
    if (user) {
        // We need to fetch the user role effectively
        // Since we can't easily use Prisma here in Edge Runtime (usually),
        // we might rely on metadata if stored, or we just pass the ID and let the API check the DB.
        // However, the API expects x-user-role.
        // For now, let's update the API to fetch the user if headers are missing,
        // OR we try to fetch the role here if possible. This middleware might not run on Edge.
        // Actually, let's look at how other APIs do auth.
        // It seems other APIs might be using getSession directly or checking DB.
        // BUT the Genre API explicitly checks headers.

        // Let's modify the API to check auth using supabase/prisma if headers are missing.
        // Relying on middleware headers for security is good pattern but needs robust implementation.
        // Given complexity of adding Prisma to middleware (Edge issues), 
        // I will FIX THE API ENDPOINTS to check auth directly instead of relying on headers.
    }

    return supabaseResponse
}
