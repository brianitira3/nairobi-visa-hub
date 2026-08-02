/**
 * Compresses an image file before upload to save database space
 * @param file - The image file to compress
 * @param maxWidth - Maximum width for the compressed image (default: 800)
 * @param quality - JPEG quality (0-1, default: 0.6)
 * @returns Promise<string> - Base64 string of compressed image
 */
export async function compressImage(
  file: File,
  maxWidth: number = 800,
  quality: number = 0.6
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with specified quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Checks if a file is an image
 * @param file - The file to check
 * @returns boolean - True if the file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}
