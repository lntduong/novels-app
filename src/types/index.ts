import { UserRole } from '@prisma/client'

export interface User {
    id: string
    email: string
    role: UserRole
}

export interface Story {
    id: string
    title: string
    slug: string
    description?: string
    coverImage?: string
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    authorId: string
    createdAt: Date
    updatedAt: Date
}

export interface Chapter {
    id: string
    title: string
    slug: string
    content: string
    order: number
    storyId: string
    createdAt: Date
    updatedAt: Date
}

export interface StoryWithChapters extends Story {
    chapters: Chapter[]
}

export interface ReadingPreferences {
    fontSize: number
    theme: 'light' | 'dark'
}
