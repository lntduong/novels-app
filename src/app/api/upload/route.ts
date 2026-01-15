import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { StorageService } from '@/lib/storage'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            )
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'File must be an image' },
                { status: 400 }
            )
        }

        // Validate file size (20MB)
        if (file.size > 20 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size must be less than 20MB' },
                { status: 400 }
            )
        }

        const session = await auth()
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        // Get bucket from form data or default to 'avatars'
        const bucket = formData.get('bucket') as string || 'avatars'

        // Upload to S3 (MinIO)
        const publicUrl = await StorageService.uploadFile(file, filePath, bucket)

        if (!publicUrl) {
            return NextResponse.json(
                { error: 'Failed to upload image' },
                { status: 500 }
            )
        }

        return NextResponse.json({ url: publicUrl })
    } catch (error) {
        console.error('Upload handler error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
