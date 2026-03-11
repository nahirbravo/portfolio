import { useState } from 'react'
import { usePortfolioStore } from '@/stores/usePortfolioStore'
import { useAdminStore } from '@/stores/useAdminStore'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import ProjectForm from '@/components/admin/ProjectForm'
import type { Project } from '@/types'

type View = 'list' | 'create' | 'edit'

export default function AdminProjectsPage() {
  const projects = usePortfolioStore((s) => s.projects)
  const { deleteProject, togglePublished } = useAdminStore()
  const [view, setView] = useState<View>('list')
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!deleting) return
    setLoading(true)
    try {
      await deleteProject(deleting.id)
    } finally {
      setLoading(false)
      setDeleting(null)
    }
  }

  const handleToggle = async (project: Project) => {
    await togglePublished(project.id, !project.published)
  }

  if (view === 'create') {
    return (
      <div>
        <h1 className="text-xl font-bold text-white mb-6">Nuevo proyecto</h1>
        <div className="max-w-2xl">
          <ProjectForm onSuccess={() => setView('list')} onCancel={() => setView('list')} />
        </div>
      </div>
    )
  }

  if (view === 'edit' && editing) {
    return (
      <div>
        <h1 className="text-xl font-bold text-white mb-6">Editar proyecto</h1>
        <div className="max-w-2xl">
          <ProjectForm
            project={editing}
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
        <h1 className="text-xl font-bold text-white">Proyectos</h1>
        <button
          onClick={() => setView('create')}
          className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium transition-all cursor-pointer"
        >
          + Agregar proyecto
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-slate-500 text-sm">No hay proyectos todavía.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 bg-[#12121A] border border-white/5 rounded-xl px-4 py-3"
            >
              {project.thumbnail_url && (
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="w-12 h-9 object-cover rounded-md shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{project.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border ${project.published ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-slate-500 bg-slate-500/10 border-slate-500/20'}`}>
                    {project.published ? 'Publicado' : 'Borrador'}
                  </span>
                  {project.featured && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full border text-cyan-400 bg-cyan-500/10 border-cyan-500/20">
                      Destacado
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(project)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                  title={project.published ? 'Despublicar' : 'Publicar'}
                >
                  {project.published ? 'Despublicar' : 'Publicar'}
                </button>
                <button
                  onClick={() => { setEditing(project); setView('edit') }}
                  className="text-xs text-slate-400 hover:text-cyan-400 px-2 py-1 rounded border border-white/10 hover:border-cyan-500/30 transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => setDeleting(project)}
                  className="text-xs text-slate-400 hover:text-red-400 px-2 py-1 rounded border border-white/10 hover:border-red-500/30 transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Eliminar proyecto"
        message={`¿Estás seguro de que querés eliminar "${deleting?.title}"? Esta acción no se puede deshacer.`}
        confirmLabel={loading ? 'Eliminando...' : 'Eliminar'}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        danger
      />
    </div>
  )
}
