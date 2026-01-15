
const { S3Client, PutBucketPolicyCommand } = require("@aws-sdk/client-s3");

const client = new S3Client({
    region: "us-east-1",
    endpoint: "http://192.168.3.200:9000",
    forcePathStyle: true,
    credentials: {
        accessKeyId: "admin",
        secretAccessKey: "password123",
    },
});

const policy = {
    Version: "2012-10-17",
    Statement: [
        {
            Sid: "PublicReadGetObject",
            Effect: "Allow",
            Principal: "*",
            Action: "s3:GetObject",
            Resource: "arn:aws:s3:::covers/*",
        },
    ],
};

const run = async () => {
    try {
        const command = new PutBucketPolicyCommand({
            Bucket: "covers",
            Policy: JSON.stringify(policy),
        });

        await client.send(command);
        console.log("Success! Bucket 'covers' is now PUBLIC.");
    } catch (err) {
        console.error("Error", err);
    }
};

run();
