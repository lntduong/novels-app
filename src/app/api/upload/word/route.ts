import { NextResponse } from 'next/server'
import { parseWordFile, detectChapters, sanitizeHtml } from '@/lib/word-parser'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        if (!file.name.endsWith('.docx')) {
            return NextResponse.json(
                { error: 'Only .docx files are supported' },
                { status: 400 }
            )
        }

        // Parse Word file to HTML
        const html = await parseWordFile(file)

        // Detect chapters from HTML
        const chapters = detectChapters(html)

        // Sanitize HTML content
        const sanitizedChapters = chapters.map((chapter) => ({
            ...chapter,
            content: sanitizeHtml(chapter.content),
        }))

        return NextResponse.json({
            success: true,
            chapters: sanitizedChapters,
            totalChapters: sanitizedChapters.length,
        })
    } catch (error) {
        console.error('Error parsing Word file:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            { error: `Failed to parse Word file: ${errorMessage}` },
            { status: 500 }
        )
    }
}
