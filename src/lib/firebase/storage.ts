import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll, type UploadMetadata } from 'firebase/storage';
import { app } from './config';

const storage = getStorage(app);

export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export const uploadFile = (
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;
    const filePath = `${folder}/${fileName}`;
    const storageRef = ref(storage, filePath);

    const metadata: UploadMetadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          onProgress({
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          });
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadURL,
            path: filePath,
            name: file.name,
            size: file.size,
            mimeType: file.type,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

export const deleteFile = async (path: string): Promise<{ error: string | null }> => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    return { error: null };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const getFileUrl = async (path: string): Promise<string> => {
  const fileRef = ref(storage, path);
  return getDownloadURL(fileRef);
};

export const listFiles = async (folder: string): Promise<string[]> => {
  const folderRef = ref(storage, folder);
  const result = await listAll(folderRef);
  return result.items.map((item) => item.fullPath);
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Format file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Ukuran file melebihi 10MB.' };
  }

  return { valid: true };
};

export const validateFile = (file: File, allowedTypes: string[] = [], maxSizeMB: number = 10): { valid: boolean; error?: string } => {
  const maxSize = maxSizeMB * 1024 * 1024;

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `Format file tidak didukung. Gunakan: ${allowedTypes.join(', ')}` };
  }

  if (file.size > maxSize) {
    return { valid: false, error: `Ukuran file melebihi ${maxSizeMB}MB.` };
  }

  return { valid: true };
};

export { storage };