import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixChapterOrders() {
    console.log('🔧 Starting chapter order fix...')

    try {
        // Get all stories
        const stories = await prisma.story.findMany({
            include: {
                chapters: true
            }
        })

        for (const story of stories) {
            console.log(`\n📚 Fixing story: ${story.title} (${story.chapters.length} chapters)`)

            // Sort chapters by extracting number from title
            const sortedChapters = story.chapters.sort((a, b) => {
                const numA = parseInt(a.title.match(/\d+/)?.[0] || '0')
                const numB = parseInt(b.title.match(/\d+/)?.[0] || '0')
                return numA - numB
            })

            // Update each chapter with correct order
            for (let i = 0; i < sortedChapters.length; i++) {
                const chapter = sortedChapters[i]
                const newOrder = i + 1

                if (chapter.order !== newOrder) {
                    await prisma.chapter.update({
                        where: { id: chapter.id },
                        data: { order: newOrder }
                    })
                    console.log(`  ✅ ${chapter.title}: ${chapter.order} → ${newOrder}`)
                } else {
                    console.log(`  ⏭️  ${chapter.title}: ${chapter.order} (already correct)`)
                }
            }
        }

        console.log('\n✅ All chapter orders fixed!')
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

fixChapterOrders()
