import { useState } from 'react'
import { usePortfolioStore } from '@/stores/usePortfolioStore'
import { useAdminStore } from '@/stores/useAdminStore'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import CertificationForm from '@/components/admin/CertificationForm'
import type { Certification } from '@/types'

type View = 'list' | 'create' | 'edit'

export default function AdminCertificationsPage() {
  const certifications = usePortfolioStore((s) => s.certifications)
  const { deleteCertification } = useAdminStore()
  const [view, setView] = useState<View>('list')
  const [editing, setEditing] = useState<Certification | null>(null)
  const [deleting, setDeleting] = useState<Certification | null>(null)
  const [loading, setLoading] = useState(false)

  // Group by category for display
  const grouped = certifications.reduce<Record<string, Certification[]>>((acc, cert) => {
    const key = cert.category ?? 'Otros'
    if (!acc[key]) acc[key] = []
    acc[key].push(cert)
    return acc
  }, {})

  const handleDelete = async () => {
    if (!deleting) return
    setLoading(true)
    try {
      await deleteCertification(deleting.id)
    } finally {
      setLoading(false)
      setDeleting(null)
    }
  }

  if (view === 'create') {
    return (
      <div>
        <h1 className="text-xl font-bold text-white mb-6">Nueva certificación</h1>
        <div className="max-w-2xl">
          <CertificationForm onSuccess={() => setView('list')} onCancel={() => setView('list')} />
        </div>
      </div>
    )
  }

  if (view === 'edit' && editing) {
    return (
      <div>
        <h1 className="text-xl font-bold text-white mb-6">Editar certificación</h1>
        <div className="max-w-2xl">
          <CertificationForm
            certification={editing}
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
        <h1 className="text-xl font-bold text-white">Certificaciones</h1>
        <button
          onClick={() => setView('create')}
          className="px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 rounded-lg text-sm font-medium transition-all cursor-pointer"
        >
          + Agregar certificación
        </button>
      </div>

      {certifications.length === 0 ? (
        <p className="text-slate-500 text-sm">No hay certificaciones todavía.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, certs]) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-violet-400 mb-3">{category}</h2>
              <div className="space-y-2">
                {certs.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center gap-4 bg-[#12121A] border border-white/5 rounded-xl px-4 py-3"
                  >
                    {cert.image_url && (
                      <img
                        src={cert.image_url}
                        alt={cert.title}
                        className="w-10 h-10 object-contain rounded bg-white/5 p-1 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{cert.title}</p>
                      <p className="text-slate-500 text-xs">
                        {cert.institution}{cert.issued_at ? ` · ${cert.issued_at}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => { setEditing(cert); setView('edit') }}
                        className="text-xs text-slate-400 hover:text-violet-400 px-2 py-1 rounded border border-white/10 hover:border-violet-500/30 transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleting(cert)}
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
        title="Eliminar certificación"
        message={`¿Estás seguro de que querés eliminar "${deleting?.title}"?`}
        confirmLabel={loading ? 'Eliminando...' : 'Eliminar'}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        danger
      />
    </div>
  )
}
