import mammoth from 'mammoth'

export interface ParsedChapter {
    title: string
    content: string
    order: number
}

export async function parseWordFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const result = await mammoth.convertToHtml({ buffer })
    return result.value
}

export function detectChapters(html: string): ParsedChapter[] {
    const chapters: ParsedChapter[] = []

    // Create a DOM parser-like structure using regex
    // Match h1, h2, h3 tags that contain chapter indicators
    const chapterPattern = /<h[123][^>]*>(.*?(?:chương|chapter|chaper)\s*(\d+)[^<]*)<\/h[123]>/gi

    let matches: RegExpMatchArray | null
    const chapterPositions: { index: number; title: string; chapterNum: number }[] = []

    // Find all chapter headings
    const tempHtml = html
    let match
    const regex = new RegExp(chapterPattern)

    while ((match = regex.exec(html)) !== null) {
        const fullTitle = match[1]
        const chapterNum = parseInt(match[2])
        chapterPositions.push({
            index: match.index,
            title: fullTitle.replace(/<[^>]*>/g, '').trim(),
            chapterNum
        })
    }

    // If no chapters detected, return entire content as one chapter
    if (chapterPositions.length === 0) {
        return [{
            title: 'Chapter 1',
            content: html,
            order: 1
        }]
    }

    // Split content by chapters
    for (let i = 0; i < chapterPositions.length; i++) {
        const currentChapter = chapterPositions[i]
        const nextChapter = chapterPositions[i + 1]

        const startIndex = currentChapter.index
        const endIndex = nextChapter ? nextChapter.index : html.length

        const content = html.substring(startIndex, endIndex).trim()

        chapters.push({
            title: currentChapter.title,
            content: content,
            order: i + 1
        })
    }

    return chapters
}

export function sanitizeHtml(html: string): string {
    // Basic HTML sanitization - remove script tags and dangerous attributes
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    cleaned = cleaned.replace(/on\w+="[^"]*"/g, '')
    cleaned = cleaned.replace(/on\w+='[^']*'/g, '')
    return cleaned
}

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}
