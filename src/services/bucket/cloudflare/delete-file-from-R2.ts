'use server';

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const DeleteFileFromR2 = async (key: string) => {
    const region = process.env.CLOUDFLARE_R2_REGION;
    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

    if (!region || !endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
        console.error("Missing environment variables:", {
            region,
            endpoint,
            accessKeyId,
            secretAccessKey,
            bucketName,
        });
        throw new Error("Missing required environment variables.");
    }

    const s3Client = new S3Client({
        region,
        endpoint,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });

    const params = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        await s3Client.send(new DeleteObjectCommand(params));
        console.log(`File with key ${key} deleted successfully from R2.`);
    } catch (error) {
        console.error("Error deleting file from R2:", error);
        throw new Error("File deletion failed.");
    }
};