import { useRef } from 'react'
import { useImageUpload } from '@/hooks/useImageUpload'

type Folder = 'avatars' | 'projects' | 'certifications'

interface ImageUploadProps {
  folder: Folder
  currentUrl?: string | null
  onUpload: (url: string) => void
  label?: string
}

export default function ImageUpload({ folder, currentUrl, onUpload, label = 'Imagen' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, uploading, error } = useImageUpload(folder)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await upload(file)
      onUpload(url)
    } catch {
      // error is shown via `error` state
    }
    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-400">{label}</label>

      {currentUrl && (
        <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-[#1A1A2E] border border-white/10">
          <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 text-xs bg-[#12121A] border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-lg transition-all disabled:opacity-50 cursor-pointer"
        >
          {uploading ? 'Subiendo...' : currentUrl ? 'Cambiar imagen' : 'Subir imagen'}
        </button>
        {currentUrl && (
          <span className="text-xs text-slate-600 truncate max-w-48">
            {currentUrl.split('/').pop()}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
