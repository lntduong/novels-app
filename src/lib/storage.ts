
import { S3Client, PutObjectCommand, HeadBucketCommand, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3"

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://localhost:9000'
const MINIO_PUBLIC_ENDPOINT = process.env.MINIO_PUBLIC_ENDPOINT || 'http://localhost:9000'
const MINIO_ACCESS_KEY = process.env.MINIO_ROOT_USER || 'admin'
const MINIO_SECRET_KEY = process.env.MINIO_ROOT_PASSWORD || 'password123'
const DEFAULT_BUCKET = process.env.MINIO_BUCKET || 'covers'
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
    static async setPublicPolicy(bucketName: string) {
        const policy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "PublicReadGetObject",
                    Effect: "Allow",
                    Principal: "*",
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
            ],
        }

        try {
            await s3Client.send(new PutBucketPolicyCommand({
                Bucket: bucketName,
                Policy: JSON.stringify(policy),
            }))
            console.log(`Public policy set for bucket ${bucketName}`)
        } catch (error) {
            console.error(`Failed to set public policy for ${bucketName}:`, error)
            // Don't throw, just log. Upload might still work if ACLs pass or manual policy exists
        }
    }

    static async ensureBucketExists(bucketName: string) {
        try {
            await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }))
            // Bucket exists, ensure it has public policy
            await this.setPublicPolicy(bucketName)
        } catch (error: any) {
            // Bucket does not exist or permission error
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                try {
                    console.log(`Bucket ${bucketName} not found, creating...`)
                    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }))
                    console.log(`Bucket ${bucketName} created successfully.`)

                    // Set public policy
                    await this.setPublicPolicy(bucketName)
                } catch (createError) {
                    console.error(`Failed to create bucket ${bucketName}:`, createError)
                    throw createError
                }
            } else {
                console.error(`Error checking bucket ${bucketName}:`, error)
                throw error
            }
        }
    }

    static async uploadFile(file: File, path: string, bucket: string = DEFAULT_BUCKET): Promise<string | null> {
        try {
            await this.ensureBucketExists(bucket)

            const buffer = Buffer.from(await file.arrayBuffer())
            const key = path.startsWith('/') ? path.substring(1) : path

            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: buffer,
                ContentType: file.type,
                // ACL: 'public-read', // MinIO might not support ACLs depending on config, usually policy is better
            })

            await s3Client.send(command)

            // Construct Public URL
            return `${MINIO_PUBLIC_ENDPOINT}/${bucket}/${key}`
        } catch (error) {
            console.error("Storage Upload Error:", error)
            return null
        }
    }
}
