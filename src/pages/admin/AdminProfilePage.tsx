import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePortfolioStore } from '@/stores/usePortfolioStore'
import { useAdminStore } from '@/stores/useAdminStore'
import ImageUpload from '@/components/admin/ImageUpload'

const schema = z.object({
  name: z.string().min(1, 'Requerido').max(100),
  title: z.string().min(1, 'Requerido').max(100),
  bio: z.string().min(1, 'Requerido').max(2000),
  email: z.string().email('Email inválido'),
  linkedin_url: z.string().url('URL inválida').optional().or(z.literal('')),
  github_url: z.string().url('URL inválida').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

export default function AdminProfilePage() {
  const profile = usePortfolioStore((s) => s.profile)
  const { updateProfile } = useAdminStore()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      email: '',
      linkedin_url: '',
      github_url: '',
    },
  })

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        email: profile.email ?? '',
        linkedin_url: profile.linkedin_url ?? '',
        github_url: profile.github_url ?? '',
      })
      setAvatarUrl(profile.avatar_url ?? null)
    }
  }, [profile, reset])

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      await updateProfile(profile?.id, {
        ...data,
        linkedin_url: data.linkedin_url || null,
        github_url: data.github_url || null,
        avatar_url: avatarUrl,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Perfil</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5">
        <ImageUpload
          folder="avatars"
          currentUrl={avatarUrl}
          onUpload={setAvatarUrl}
          label="Avatar"
        />

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Nombre *</label>
          <input
            {...register('name')}
            className="w-full bg-[#12121A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Título *</label>
          <input
            {...register('title')}
            placeholder="Frontend Developer"
            className="w-full bg-[#12121A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Bio *</label>
          <textarea
            {...register('bio')}
            rows={5}
            className="w-full bg-[#12121A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
          />
          {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Email *</label>
          <input
            {...register('email')}
            type="email"
            className="w-full bg-[#12121A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">LinkedIn URL</label>
            <input
              {...register('linkedin_url')}
              placeholder="https://linkedin.com/in/..."
              className="w-full bg-[#12121A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            {errors.linkedin_url && <p className="text-red-400 text-xs mt-1">{errors.linkedin_url.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">GitHub URL</label>
            <input
              {...register('github_url')}
              placeholder="https://github.com/..."
              className="w-full bg-[#12121A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            {errors.github_url && <p className="text-red-400 text-xs mt-1">{errors.github_url.message}</p>}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">Perfil actualizado correctamente.</p>}

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
        >
          {submitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
