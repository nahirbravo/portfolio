import { useState, useRef, KeyboardEvent } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Project } from '@/types'
import { useAdminStore } from '@/stores/useAdminStore'
import { useImageUpload } from '@/hooks/useImageUpload'
import ImageUpload from './ImageUpload'

const MAX_GALLERY_IMAGES = 10

const schema = z.object({
  title: z.string().min(1, 'Requerido').max(150),
  description: z.string().min(1, 'Requerido').max(2000),
  preview_url: z.string().url('URL inválida').optional().or(z.literal('')),
  repo_url: z.string().url('URL inválida').optional().or(z.literal('')),
  featured: z.boolean(),
  published: z.boolean(),
  sort_order: z.number().int().default(0),
})

type FormData = z.infer<typeof schema>

interface ProjectFormProps {
  project?: Project
  onSuccess: () => void
  onCancel: () => void
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const { createProject, updateProject } = useAdminStore()
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(project?.thumbnail_url ?? null)
  const [tags, setTags] = useState<string[]>(project?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [galleryUrls, setGalleryUrls] = useState<string[]>(project?.images ?? [])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const { upload: uploadGallery, uploading: uploadingGallery, error: galleryError } = useImageUpload('projects')

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project?.title ?? '',
      description: project?.description ?? '',
      preview_url: project?.preview_url ?? '',
      repo_url: project?.repo_url ?? '',
      featured: project?.featured ?? false,
      published: project?.published ?? true,
      sort_order: project?.sort_order ?? 0,
    },
  })

  const addTag = () => {
    const val = tagInput.trim()
    if (val && !tags.includes(val) && tags.length < 15) {
      setTags([...tags, val])
      setTagInput('')
    }
  }

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag))

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const remaining = MAX_GALLERY_IMAGES - galleryUrls.length
    const toUpload = files.slice(0, remaining)
    try {
      const urls = await Promise.all(toUpload.map((f) => uploadGallery(f)))
      setGalleryUrls((prev) => [...prev, ...urls])
    } catch {
      // galleryError state shows the error
    }
    if (galleryInputRef.current) galleryInputRef.current.value = ''
  }

  const removeGalleryImage = (idx: number) =>
    setGalleryUrls((prev) => prev.filter((_, i) => i !== idx))

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        ...data,
        preview_url: data.preview_url || null,
        repo_url: data.repo_url || null,
        tags,
        thumbnail_url: thumbnailUrl,
        images: galleryUrls,
      }
      if (project) {
        await updateProject(project.id, payload)
      } else {
        await createProject(payload)
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Título *</label>
          <input
            {...register('title')}
            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Descripción *</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
          />
          {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">URL Preview</label>
            <input
              {...register('preview_url')}
              placeholder="https://"
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            {errors.preview_url && <p className="text-red-400 text-xs mt-1">{errors.preview_url.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">URL Repo</label>
            <input
              {...register('repo_url')}
              placeholder="https://github.com/..."
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            {errors.repo_url && <p className="text-red-400 text-xs mt-1">{errors.repo_url.message}</p>}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Tags (Enter o coma para agregar)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 text-xs bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 cursor-pointer">×</button>
              </span>
            ))}
          </div>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={addTag}
            placeholder="React, TypeScript..."
            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Thumbnail */}
        <ImageUpload
          folder="projects"
          currentUrl={thumbnailUrl}
          onUpload={setThumbnailUrl}
          label="Thumbnail"
        />

        {/* Galería de imágenes adicionales */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-400">
              Galería ({galleryUrls.length}/{MAX_GALLERY_IMAGES})
            </label>
            {galleryUrls.length < MAX_GALLERY_IMAGES && (
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingGallery}
                className="px-3 py-1.5 text-xs bg-[#12121A] border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {uploadingGallery ? 'Subiendo...' : '+ Agregar imagen'}
              </button>
            )}
          </div>

          {galleryUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {galleryUrls.map((url, i) => (
                <div key={url} className="relative group/img rounded-lg overflow-hidden bg-[#1A1A2E] border border-white/10 aspect-video">
                  <img src={url} alt={`Galería ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500/80 hover:bg-red-500 text-white text-xs rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleGalleryChange}
            className="hidden"
          />

          {galleryError && <p className="text-red-400 text-xs">{galleryError}</p>}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6">
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={field.value} onChange={field.onChange} className="w-4 h-4 accent-cyan-500" />
                <span className="text-sm text-slate-400">Destacado</span>
              </label>
            )}
          />
          <Controller
            name="published"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={field.value} onChange={field.onChange} className="w-4 h-4 accent-cyan-500" />
                <span className="text-sm text-slate-400">Publicado</span>
              </label>
            )}
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
        >
          {submitting ? 'Guardando...' : project ? 'Actualizar' : 'Crear proyecto'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-slate-400 hover:text-white text-sm transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
