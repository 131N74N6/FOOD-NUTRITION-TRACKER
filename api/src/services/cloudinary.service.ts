import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import { Readable } from "stream";

export type CloudinaryUploadResult = {
    public_id: string;
    resource_type: string;
    url: string;
}

export type CloudinaryUploadOptions = {
    fileBuffer: Buffer,
    folder: string,
    originalName: string
}

export async function uploadToCloudinary(options: CloudinaryUploadOptions): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        const publicId = `${Date.now()}_${options.originalName}`;
        const uploadStream = v2.uploader.upload_stream({
            folder: options.folder,
            public_id: publicId,
            resource_type: "auto"
        }, (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (error) {
                reject(new Error('Failed to upload to Cloudinary'));
                return;
            }
            if (!result) {
                reject(new Error('No result returned from Cloudinary'));
                return;
            }
            resolve({
                public_id: result.public_id,
                resource_type: result.resource_type,
                url: result.secure_url
            });
        });

        const readableStream = new Readable();
        readableStream.push(options.fileBuffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
}