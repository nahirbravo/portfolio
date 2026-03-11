import { useState } from 'react'
import { usePortfolioStore } from '@/stores/usePortfolioStore'
import { useAdminStore } from '@/stores/useAdminStore'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import SkillForm from '@/components/admin/SkillForm'
import type { Skill } from '@/types'

type View = 'list' | 'create' | 'edit'

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  expert: 'Experto',
}

export default function AdminSkillsPage() {
  const skills = usePortfolioStore((s) => s.skills)
  const { deleteSkill } = useAdminStore()
  const [view, setView] = useState<View>('list')
  const [editing, setEditing] = useState<Skill | null>(null)
  const [deleting, setDeleting] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(false)

  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category
    if (!acc[key]) acc[key] = []
    acc[key].push(skill)
    return acc
  }, {})

  const handleDelete = async () => {
    if (!deleting) return
    setLoading(true)
    try {
      await deleteSkill(deleting.id)
    } finally {
      setLoading(false)
      setDeleting(null)
    }
  }

  if (view === 'create') {
    return (
      <div>
        <h1 className="text-xl font-bold text-white mb-6">Nuevo skill</h1>
        <div className="max-w-lg">
          <SkillForm onSuccess={() => setView('list')} onCancel={() => setView('list')} />
        </div>
      </div>
    )
  }

  if (view === 'edit' && editing) {
    return (
      <div>
        <h1 className="text-xl font-bold text-white mb-6">Editar skill</h1>
        <div className="max-w-lg">
          <SkillForm
            skill={editing}
            onSuccess={() => { setView('list'); setEditing(null) }}
            onCancel={() => { setView('list'); setEditing(null) }}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Skills</h1>
        <button
          onClick={() => setView('create')}
          className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium transition-all cursor-pointer"
        >
          + Agregar skill
        </button>
      </div>

      {skills.length === 0 ? (
        <p className="text-slate-500 text-sm">No hay skills todavía.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-slate-300 mb-3">{category}</h2>
              <div className="space-y-2">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-4 bg-[#12121A] border border-white/5 rounded-xl px-4 py-3"
                  >
                    {skill.icon && (
                      <span className="text-xl w-7 text-center shrink-0">{skill.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{skill.name}</p>
                      {skill.level && (
                        <p className="text-slate-500 text-xs">{LEVEL_LABELS[skill.level] ?? skill.level}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => { setEditing(skill); setView('edit') }}
                        className="text-xs text-slate-400 hover:text-cyan-400 px-2 py-1 rounded border border-white/10 hover:border-cyan-500/30 transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleting(skill)}
                        className="text-xs text-slate-400 hover:text-red-400 px-2 py-1 rounded border border-white/10 hover:border-red-500/30 transition-colors cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Eliminar skill"
        message={`¿Estás seguro de que querés eliminar "${deleting?.name}"?`}
        confirmLabel={loading ? 'Eliminando...' : 'Eliminar'}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        danger
      />
    </div>
  )
}
