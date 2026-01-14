import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ChapterClientPage from '@/components/public/chapter-client-page'

export default async function ChapterReaderPage({
    params,
}: {
    params: Promise<{ slug: string; chapterSlug: string }>
}) {
    const { slug, chapterSlug } = await params

    const story = await prisma.story.findUnique({
        where: { slug, status: 'PUBLISHED' },
        include: {
            chapters: {
                orderBy: { order: 'asc' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    order: true,
                }
            },
        },
    })

    if (!story) {
        notFound()
    }

    // Need to fetch the full chapter content for the *current* chapter separately
    // OR fetch it in the first query but select only necessary fields for others.
    // The previous query fetched ALL chapters with all fields (including content!). 
    // That's heavy if chapters are long.
    // Optimization: The findUnique above fetches all chapter metadata for navigation.
    // Then we fetch the specific chapter content.

    // Actually, looking at the previous code, it fetched `include: { chapters: ... }` which implies ALL fields. 
    // If chapters have 'content', that's huge payload.
    // Better to fetch story with only chapter metadata, then fetch the current chapter.

    // Let's refine the query:
    // 1. Fetch Story + Chapter Metadata (ID, Title, Slug, Order)
    // 2. Fetch Current Chapter (Content, Password)

    const storyMetadata = await prisma.story.findUnique({
        where: { slug, status: 'PUBLISHED' },
        select: {
            id: true,
            title: true,
            slug: true,
            chapters: {
                orderBy: { order: 'asc' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    order: true
                }
            }
        }
    })

    if (!storyMetadata) notFound()

    const currentChapterMetadata = storyMetadata.chapters.find((ch) => ch.slug === chapterSlug)

    if (!currentChapterMetadata) {
        notFound()
    }

    // Fetch the full content for the current chapter
    const fullChapter = await prisma.chapter.findUnique({
        where: { id: currentChapterMetadata.id }
    })

    if (!fullChapter) notFound()

    const currentIndex = storyMetadata.chapters.findIndex((ch) => ch.id === fullChapter.id)
    const previousChapter = currentIndex > 0 ? storyMetadata.chapters[currentIndex - 1] : null
    const nextChapter =
        currentIndex < storyMetadata.chapters.length - 1 ? storyMetadata.chapters[currentIndex + 1] : null

    return (
        <ChapterClientPage
            chapter={fullChapter}
            story={{
                id: storyMetadata.id,
                title: storyMetadata.title,
                slug: storyMetadata.slug,
                chaptersCount: storyMetadata.chapters.length
            }}
            previousChapter={previousChapter}
            nextChapter={nextChapter}
            currentIndex={currentIndex}
        />
    )
}
