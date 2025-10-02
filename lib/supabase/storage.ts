import { supabase } from './client';

export const APPRAISAL_IMAGES_BUCKET = 'appraisal-images';

export async function uploadAppraisalImage(
  file: File,
  appraisalId: string,
  displayOrder: number = 0
): Promise<{ path: string; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${appraisalId}/${Date.now()}-${displayOrder}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(APPRAISAL_IMAGES_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { path: '', error };
    }

    return { path: data.path, error: null };
  } catch (error) {
    return { path: '', error: error as Error };
  }
}

export function getImageUrl(path: string): string {
  const { data } = supabase.storage
    .from(APPRAISAL_IMAGES_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function deleteAppraisalImage(path: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.storage
    .from(APPRAISAL_IMAGES_BUCKET)
    .remove([path]);

  return { error };
}
