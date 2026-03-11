import { supabase } from '@/lib/supabase'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2MB

/**
 * Uploads an image file to Supabase Storage and returns its public URL.
 * @param folder - Storage folder: 'avatars' | 'projects' | 'certifications'
 * @param file - File to upload
 * @returns Public URL of the uploaded image
 * @throws Error if file type invalid, file too large, or upload fails
 */
export async function uploadImage(
  folder: 'avatars' | 'projects' | 'certifications',
  file: File
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Solo JPG, PNG o WebP.')
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('La imagen no puede superar 2MB. Redimensionala antes de subir.')
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('portfolio-images')
    .upload(path, file, { upsert: false })

  if (error) throw new Error(`Error al subir imagen: ${error.message}`)

  const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path)
  return data.publicUrl
}

/**
 * Deletes an image from Supabase Storage given its public URL.
 * Fails silently if path can't be extracted.
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  try {
    const url = new URL(publicUrl)
    // Extract path after /object/public/portfolio-images/
    const match = url.pathname.match(/\/object\/public\/portfolio-images\/(.+)/)
    if (!match?.[1]) return
    await supabase.storage.from('portfolio-images').remove([match[1]])
  } catch {
    // Silently ignore — image deletion is best-effort
  }
}
