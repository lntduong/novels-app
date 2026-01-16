import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ChapterClientPage from '@/components/public/chapter-client-page'

import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; chapterSlug: string }> }): Promise<Metadata> {
    const { slug, chapterSlug } = await params
    const story = await prisma.story.findUnique({
        where: { slug },
        select: { title: true, authorName: true, coverImage: true, chapters: { where: { slug: chapterSlug }, select: { title: true } } }
    })

    if (!story || !story.chapters[0]) {
        return {
            title: 'Chapter Not Found',
        }
    }

    const chapter = story.chapters[0]
    const title = `${chapter.title} - ${story.title}`
    const description = `Read ${chapter.title} of ${story.title} by ${story.authorName || 'Unknown author'} online for free.`
    const images = story.coverImage ? [story.coverImage] : []

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'book',
            authors: story.authorName ? [story.authorName] : undefined,
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images,
        },
    }
}



export default async function ChapterReaderPage({
    params,
}: {
    params: Promise<{ slug: string; chapterSlug: string }>
}) {
    const { slug, chapterSlug } = await params

    // This query is leftover from previous attempts or might need adjustment if logic was duplicated. 
    // But based on current file state, this `const story = ...` follows.
    // However, looking at the file, line 45 is `const story = ...`.


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
            authorName: true,
            coverImage: true,
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

    // structured data for breadcrumbs and chapter
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: 'https://novels.yangyu.win',
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: storyMetadata.title,
                        item: `https://novels.yangyu.win/story/${storyMetadata.slug}`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: fullChapter.title,
                    },
                ],
            },
            {
                '@type': 'WebPage',
                name: `${fullChapter.title} - ${storyMetadata.title}`,
                description: `Read ${fullChapter.title} of ${storyMetadata.title} online`,
                isPartOf: {
                    '@type': 'Book',
                    name: storyMetadata.title,
                    author: {
                        '@type': 'Person',
                        name: storyMetadata.authorName || 'Unknown',
                    },
                },
            },
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
        </>
    )
}
