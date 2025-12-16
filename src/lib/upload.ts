/**
 * Mock Image Upload Service
 * In a real application, you would use S3, Uploadthing, or Cloudinary.
 */
export async function uploadImage(file: File): Promise<string> {
    console.log("🚀 Uploading file:", file.name, file.size);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
  
    // Return a mock URL (e.g., from a placeholder service or just a static image)
    // In dev, we can't easily upload to local filesystem in Next.js App Router without hacks.
    // So we return a placeholder that looks like an uploaded image.
    
    // Generate a random ID to make it look dynamic
    const randomId = Math.floor(Math.random() * 1000);
    return `https://via.placeholder.com/600x400?text=Uploaded+Image+${randomId}`;
  }
  
  /* 
  // Example implementation with Uploadthing (pseudo-code)
  import { utapi } from "uploadthing/server";
  
  export async function uploadImageReal(file: File) {
      const response = await utapi.uploadFiles([file]);
      return response[0].data.url;
  }
  */
