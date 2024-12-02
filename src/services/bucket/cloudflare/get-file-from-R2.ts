'use server';

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from 'stream';

export const GetFileFromR2 = async (key: string): Promise<File> => {
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
        const { Body } = await s3Client.send(new GetObjectCommand(params));
        const stream = Body as Readable;
        const chunks: Buffer[] = [];

        for await (const chunk of stream) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);
        const blob = new Blob([buffer]);
        const file = new File([blob], key);

        return file;
    } catch (error) {
        console.error("Error fetching file from R2:", error);
        throw new Error("File fetch failed.");
    }
};