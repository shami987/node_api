import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (fileBuffer: Buffer, folder = "products") => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as any);
      }
    ).end(fileBuffer);
  });
};
