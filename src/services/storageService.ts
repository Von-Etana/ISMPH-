import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { compressImage } from '../utils/imageProcess';

export interface UploadResult {
  url: string | null;
  error: string | null;
  fileName?: string;
}

export const storageService = {
  /**
   * Uploads multiple files to Supabase Storage with compression
   * @param uris Array of local file URIs
   * @param onProgress Callback (uri, progress) - progress is 0 to 1
   * @param bucket Name of the storage bucket
   * @param path Optional sub-path within the bucket
   */
  uploadFiles: async (
    uris: string[],
    onProgress?: (uri: string, progress: number) => void,
    bucket: string = 'reports',
    path: string = 'media'
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];

    for (const uri of uris) {
      try {
        // 1. Initial sub-progress
        if (onProgress) onProgress(uri, 0.1);

        // 2. Compress image
        const compressedUri = uri.endsWith('.gif') ? uri : await compressImage(uri);
        if (onProgress) onProgress(uri, 0.3);

        // 3. Get file info
        const fileInfo = await FileSystem.getInfoAsync(compressedUri);
        if (!fileInfo.exists) {
          results.push({ url: null, error: `File not found: ${compressedUri}` });
          if (onProgress) onProgress(uri, 0);
          continue;
        }

        // 4. Prepare file name and path
        const fileName = compressedUri.split('/').pop() || `upload_${Date.now()}`;
        const fileExt = fileName.split('.').pop()?.toLowerCase() || 'jpg';
        const timestamp = Date.now();
        const filePath = `${path}/${timestamp}_${fileName}`;

        // 5. Read file as base64
        const base64 = await FileSystem.readAsStringAsync(compressedUri, {
          encoding: 'base64',
        });
        if (onProgress) onProgress(uri, 0.5);

        // 6. Convert base64 to ArrayBuffer
        const arrayBuffer = decode(base64);

        // 7. Upload to Supabase
        // Note: Real-time progress on RN for a single file can be tricky with base64 conversion
        // but we are tracking steps.
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, arrayBuffer, {
            contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
            upsert: true,
          });

        if (error) {
          console.error('[StorageService] Upload error:', error);
          results.push({ url: null, error: error.message });
          if (onProgress) onProgress(uri, 0);
          continue;
        }

        // 8. Get Public URL
        if (onProgress) onProgress(uri, 0.9);
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        if (onProgress) onProgress(uri, 1.0);
        results.push({ url: publicUrl, error: null, fileName });
      } catch (err: any) {
        console.error('[StorageService] Unexpected error:', err);
        results.push({ url: null, error: err.message || 'Unknown error' });
        if (onProgress) onProgress(uri, 0);
      }
    }

    return results;
  },

  /**
   * Deletes files from Supabase Storage
   */
  deleteFiles: async (paths: string[], bucket: string = 'reports'): Promise<void> => {
    try {
      const { error } = await supabase.storage.from(bucket).remove(paths);
      if (error) throw error;
    } catch (err) {
      console.error('[StorageService] Delete error:', err);
    }
  },
};
