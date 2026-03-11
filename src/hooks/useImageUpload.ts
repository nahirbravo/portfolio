import { useState } from 'react'
import { uploadImage } from '@/utils/imageUpload'

type Folder = 'avatars' | 'projects' | 'certifications'

interface UseImageUploadReturn {
  upload: (file: File) => Promise<string>
  uploading: boolean
  error: string | null
  clearError: () => void
}

export function useImageUpload(folder: Folder): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File): Promise<string> {
    setUploading(true)
    setError(null)
    try {
      const url = await uploadImage(folder, file)
      return url
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir imagen'
      setError(message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, error, clearError: () => setError(null) }
}
