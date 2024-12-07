import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import{AWS_BUCKET_NAME,AWS_BUCKET_REGION,AWS_PUBLIC_KEY,AWS_SECRET_KEY,AWS_SESSION_TOKEN} from "../lib/config.js"


const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId : AWS_PUBLIC_KEY,
        secretAccessKey : AWS_SECRET_KEY,
        sessionToken: AWS_SESSION_TOKEN
    }
});

export async function uploadFile(file) {
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.name,
        Body: file.data,
        ContentType : file.mimetype
    }
    const command = new PutObjectCommand(uploadParams)
    await client.send(command)

    return `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${file.name}`;
}
