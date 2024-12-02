'use server';

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const UploadFileToR2 = async (file: File, key: string) => {
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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
    };

    try {
        const s3 = await s3Client.send(new PutObjectCommand(params));
        console.log(`Upload para R2 bem-sucedido: ${s3}`);
        const fileUrl = `${endpoint}/${key}`;
        return fileUrl;
    } catch (error) {
        console.error("Erro no upload para R2:", error);
        throw new Error("Upload falhou.");
    }
};
