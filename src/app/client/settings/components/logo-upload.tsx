'use strict';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DeleteFileFromR2,
    GetFileFromR2,
    UploadFileToR2
} from "@/services/bucket/cloudflare/";

import { Box, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LogoUploadProps {
    formData: {
        logo: string
    }
    setFormData: React.Dispatch<React.SetStateAction<unknown>>
}

export default function LogoUpload({ formData, setFormData }: LogoUploadProps) {
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        const loadImage = async () => {
            if (formData.logo) {
                try {
                    const imageUrl = await GetFileFromR2(formData.logo);
                    setPreview(URL.createObjectURL(imageUrl));
                } catch (error) {
                    console.error('Failed to load image:', error);
                }
            }
        };

        loadImage();
    }, [formData.logo]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));

            await handleUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                setImage(file);
                setPreview(URL.createObjectURL(file));
                handleUpload(file);
            }
        }
    };

    const handleUpload = async (file: File) => {
        if (file) {
            try {
                const key = `logos/${Date.now()}-${file.name}`;
                await UploadFileToR2(file, key);
                setFormData({ ...formData, logo: key });
            } catch (error) {
                console.error('Failed to upload image:', error);
            }
        }
    }

    const handleDelete = async () => {
        if (formData.logo) {
            try {
                await DeleteFileFromR2(formData.logo);

                setFormData({ ...formData, logo: '' });
                setImage(null);
                setPreview(null);
            } catch (error) {
                console.error('Failed to delete image:', error);
            }
        }
    }

    return (
        <div className="space-y-6">
            <div
                className={`relative w-full h-64 border-2 border-dashed rounded-lg
      ${isDragging ? 'border-[#0047AB]' : 'border-gray-700'}
      transition-colors duration-200`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                        handleImageChange(e);
                    }}
                />

                {preview ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src={preview}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="max-w-[200px] max-h-[200px] object-contain"
                        />
                    </div>
                ) : (
                    <label
                        htmlFor="image"
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                    >
                        <Box className="w-12 h-12 text-gray-400 mb-4" />
                        <div className="text-center">
                            <p className="text-lg text-white">
                                Clique ou arraste o arquivo para esta área
                            </p>
                            <p className="mt-2 text-sm text-gray-400">
                                Suporte para upload único de imagem. É proibido fazer upload de arquivos não permitidos.
                            </p>
                        </div>
                    </label>
                )}
            </div>

            {formData.logo && (
                <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <Image
                            src={preview || ''}
                            alt="Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                        <span className="text-white">{image?.name || 'Logo atual'}</span>
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            )}
        </div>
    )
}