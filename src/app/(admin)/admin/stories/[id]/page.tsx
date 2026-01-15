import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { canManageContent } from '@/lib/permissions'
import StoryEditForm from '@/components/admin/story-edit-form'
import ChaptersList from '@/components/admin/chapters-list'
import WordUpload from '@/components/admin/word-upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function StoryEditPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const session = await auth()
    const user = session?.user

    if (!user) {
        redirect('/login')
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
    })

    if (!dbUser || !canManageContent(dbUser.role)) {
        redirect('/admin')
    }

    const story = await prisma.story.findUnique({
        where: { id },
        include: {
            chapters: {
                orderBy: { order: 'asc' },
            },
            genres: true,
        },
    })

    if (!story) {
        notFound()
    }

    const serializedStory = {
        ...story,
        createdAt: story.createdAt.toISOString(),
        updatedAt: story.updatedAt.toISOString(),
    }

    const serializedChapters = story.chapters.map(chapter => ({
        ...chapter,
        createdAt: chapter.createdAt.toISOString(),
        updatedAt: chapter.updatedAt.toISOString(),
    }))

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Chỉnh sửa truyện
            </h2>

            <StoryEditForm story={serializedStory} />

            <Card>
                <CardHeader>
                    <CardTitle>Tải lên tài liệu Word</CardTitle>
                </CardHeader>
                <CardContent>
                    <WordUpload storyId={story.id} />
                </CardContent>
            </Card>

            <ChaptersList storyId={story.id} initialChapters={serializedChapters} />
        </div>
    )
}
