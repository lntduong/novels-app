import PublicHeader from "@/components/public/public-header"
import { auth } from "@/auth"

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader user={session?.user} />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
