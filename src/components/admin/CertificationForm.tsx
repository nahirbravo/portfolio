import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Certification } from '@/types'
import { useAdminStore } from '@/stores/useAdminStore'
import ImageUpload from './ImageUpload'

const CATEGORY_SUGGESTIONS = ['Frontend', 'Backend', 'Cloud', 'DevOps', 'Mobile', 'Data', 'Diseño']

const schema = z.object({
  title: z.string().min(1, 'Requerido').max(200),
  institution: z.string().min(1, 'Requerido').max(150),
  issued_at: z.string().max(20).optional().or(z.literal('')),
  credential_url: z.string().url('URL inválida').optional().or(z.literal('')),
  category: z.string().min(1, 'Requerida').max(50),
  sort_order: z.number().int().default(0),
})

type FormData = z.infer<typeof schema>

interface CertificationFormProps {
  certification?: Certification
  onSuccess: () => void
  onCancel: () => void
}

export default function CertificationForm({ certification, onSuccess, onCancel }: CertificationFormProps) {
  const { createCertification, updateCertification } = useAdminStore()
  const [imageUrl, setImageUrl] = useState<string | null>(certification?.image_url ?? null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: certification?.title ?? '',
      institution: certification?.institution ?? '',
      issued_at: certification?.issued_at ?? '',
      credential_url: certification?.credential_url ?? '',
      category: certification?.category ?? '',
      sort_order: certification?.sort_order ?? 0,
    },
  })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        ...data,
        issued_at: data.issued_at || null,
        credential_url: data.credential_url || null,
        image_url: imageUrl,
      }
      if (certification) {
        await updateCertification(certification.id, payload)
      } else {
        await createCertification(payload)
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Título *</label>
        <input
          {...register('title')}
          className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
        />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Institución *</label>
        <input
          {...register('institution')}
          placeholder="Udemy, Platzi, Coursera..."
          className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
        />
        {errors.institution && <p className="text-red-400 text-xs mt-1">{errors.institution.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Año (opcional)</label>
          <input
            {...register('issued_at')}
            placeholder="ej: 2023"
            maxLength={20}
            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          {errors.issued_at && <p className="text-red-400 text-xs mt-1">{errors.issued_at.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Categoría *</label>
          <input
            {...register('category')}
            list="category-suggestions"
            placeholder="Frontend, Backend..."
            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <datalist id="category-suggestions">
            {CATEGORY_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">URL del certificado</label>
        <input
          {...register('credential_url')}
          placeholder="https://"
          className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
        />
        {errors.credential_url && <p className="text-red-400 text-xs mt-1">{errors.credential_url.message}</p>}
      </div>

      <ImageUpload
        folder="certifications"
        currentUrl={imageUrl}
        onUpload={setImageUrl}
        label="Imagen del certificado (opcional)"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 rounded-lg text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
        >
          {submitting ? 'Guardando...' : certification ? 'Actualizar' : 'Crear certificación'}
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
