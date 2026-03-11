import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Skill, SkillLevel } from '@/types'
import { useAdminStore } from '@/stores/useAdminStore'

const CATEGORY_SUGGESTIONS = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'Tools', 'Database', 'Cloud']

const schema = z.object({
  name: z.string().min(1, 'Requerido').max(50),
  category: z.string().min(1, 'Requerida').max(50),
  icon: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  sort_order: z.number().int().default(0),
})

type FormData = z.infer<typeof schema>

interface SkillFormProps {
  skill?: Skill
  onSuccess: () => void
  onCancel: () => void
}

const LEVEL_OPTIONS: { value: SkillLevel; label: string }[] = [
  { value: 'beginner', label: 'Básico' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
  { value: 'expert', label: 'Experto' },
]

export default function SkillForm({ skill, onSuccess, onCancel }: SkillFormProps) {
  const { createSkill, updateSkill } = useAdminStore()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: skill?.name ?? '',
      category: skill?.category ?? '',
      icon: skill?.icon ?? '',
      level: skill?.level ?? 'intermediate',
      sort_order: skill?.sort_order ?? 0,
    },
  })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setError(null)
    try {
      const payload = { ...data, icon: data.icon || null }
      if (skill) {
        await updateSkill(skill.id, payload)
      } else {
        await createSkill(payload)
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Nombre *</label>
          <input
            {...register('name')}
            placeholder="React, TypeScript..."
            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Categoría *</label>
          <input
            {...register('category')}
            list="skill-category-suggestions"
            placeholder="Frontend..."
            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <datalist id="skill-category-suggestions">
            {CATEGORY_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Ícono (emoji)</label>
          <input
            {...register('icon')}
            placeholder="⚛️"
            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Nivel *</label>
          <select
            {...register('level')}
            className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.level && <p className="text-red-400 text-xs mt-1">{errors.level.message}</p>}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
        >
          {submitting ? 'Guardando...' : skill ? 'Actualizar' : 'Agregar skill'}
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
