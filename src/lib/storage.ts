
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://localhost:9000'
const MINIO_PUBLIC_ENDPOINT = process.env.MINIO_PUBLIC_ENDPOINT || 'http://localhost:9000'
const MINIO_ACCESS_KEY = process.env.MINIO_ROOT_USER || 'admin'
const MINIO_SECRET_KEY = process.env.MINIO_ROOT_PASSWORD || 'password123'
const MINIO_BUCKET = process.env.MINIO_BUCKET || 'covers'
const MINIO_REGION = process.env.MINIO_REGION || 'us-east-1'

// Initialize S3 Client
const s3Client = new S3Client({
    region: MINIO_REGION,
    endpoint: MINIO_ENDPOINT,
    forcePathStyle: true, // Required for MinIO
    credentials: {
        accessKeyId: MINIO_ACCESS_KEY,
        secretAccessKey: MINIO_SECRET_KEY,
    },
})

export class StorageService {
    static async uploadFile(file: File, path: string): Promise<string | null> {
        try {
            const buffer = Buffer.from(await file.arrayBuffer())
            const key = path.startsWith('/') ? path.substring(1) : path

            const command = new PutObjectCommand({
                Bucket: MINIO_BUCKET,
                Key: key,
                Body: buffer,
                ContentType: file.type,
                ACL: 'public-read', // Ensure public access if policy allows
            })

            await s3Client.send(command)

            // Construct Public URL
            // If using Cloudflare Tunnel for MinIO, use the public endpoint
            // Otherwise fallback to basic structure
            return `${MINIO_PUBLIC_ENDPOINT}/${MINIO_BUCKET}/${key}`
        } catch (error) {
            console.error("Storage Upload Error:", error)
            return null
        }
    }
}
