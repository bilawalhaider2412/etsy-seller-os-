import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './firebase-client.ts';

export type StorageCategory = 'products' | 'listings' | 'knowledge' | 'generated' | 'profile';

export interface UploadResult {
  url: string;
  fullPath: string;
  name: string;
  size: number;
  contentType: string;
}

/**
 * Uploads a file to Firebase Storage under the appropriate workspace / user directory.
 */
export async function uploadWorkspaceFile(
  workspaceId: string,
  category: StorageCategory,
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  // Validate file size (< 15MB)
  const maxBytes = 15 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('File exceeds maximum allowed size of 15MB');
  }

  // Validate file type
  const allowedPrefixes = ['image/', 'application/pdf', 'text/csv', 'text/plain', 'application/json'];
  const isAllowed = allowedPrefixes.some((p) => file.type.startsWith(p) || file.type === p);
  if (!isAllowed) {
    throw new Error(`File type ${file.type} is not allowed. Only images and standard documents are supported.`);
  }

  const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = `workspaces/${workspaceId}/${category}/${cleanFileName}`;
  const storageRef = ref(storage, filePath);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(percent);
      },
      (error) => {
        console.error('Storage upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadUrl,
            fullPath: filePath,
            name: file.name,
            size: file.size,
            contentType: file.type,
          });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Uploads a user profile image to `users/{uid}/profile/`.
 */
export async function uploadUserProfileImage(
  uid: string,
  file: File
): Promise<string> {
  const filePath = `users/${uid}/profile/avatar_${Date.now()}`;
  const storageRef = ref(storage, filePath);
  const snapshot = await uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });
  return getDownloadURL(snapshot.ref);
}
