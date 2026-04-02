import * as ImageManipulator from 'expo-image-manipulator';

export interface ImageProcessResult {
  uri: string;
  width: number;
  height: number;
  base64?: string;
}

/**
 * Compresses and resizes an image before upload
 * @param uri Local URI of the image
 * @param maxWidth Optional maximum width
 * @param quality Compression quality (0-1)
 */
export const compressImage = async (
  uri: string,
  maxWidth: number = 1024,
  quality: number = 0.7
): Promise<string> => {
  try {
    // 1. Get original dimensions if needed (optional)
    // 2. Perform manipulation
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );

    return result.uri;
  } catch (error) {
    console.error('[ImageProcess] Compression error:', error);
    return uri; // Return original on failure
  }
};

/**
 * Processes multiple images
 */
export const compressImages = async (
  uris: string[],
  maxWidth: number = 1024,
  quality: number = 0.7
): Promise<string[]> => {
  return Promise.all(uris.map(uri => compressImage(uri, maxWidth, quality)));
};
