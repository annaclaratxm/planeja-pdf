'use server';

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from 'stream';

const validateEnvVariables = (): void => {
    const missingVariables: string[] = [];
    const requiredEnvVars = {
        CLOUDFLARE_R2_REGION: process.env.CLOUDFLARE_R2_REGION,
        CLOUDFLARE_R2_ENDPOINT: process.env.CLOUDFLARE_R2_ENDPOINT,
        CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    };

    for (const [key, value] of Object.entries(requiredEnvVars)) {
        if (!value) missingVariables.push(key);
    }

    if (missingVariables.length > 0) {
        throw new Error(`Missing environment variables: ${missingVariables.join(", ")}`);
    }
};

export const GetFileFromR2 = async (key: string): Promise<File> => {
    validateEnvVariables();

    const s3Client = new S3Client({
        region: process.env.CLOUDFLARE_R2_REGION!,
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
        credentials: {
            accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
        },
    });

    const params = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
        Key: key,
    };

    try {
        const { Body } = await s3Client.send(new GetObjectCommand(params));

        if (!(Body instanceof Readable)) {
            throw new Error("Received body is not a readable stream.");
        }

        const chunks: Buffer[] = [];
        for await (const chunk of Body) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);
        const blob = new Blob([buffer]);
        return new File([blob], key);
    } catch (error) {
        console.error("Error fetching file from R2:", error);
        throw new Error(`File fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
