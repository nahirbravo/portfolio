import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useShallow } from 'zustand/shallow'
import { usePortfolioStore } from '@/stores/usePortfolioStore'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'

const TAG_COLORS = [
  'bg-violet-500/15 text-violet-300 border-violet-500/20',
  'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  'bg-pink-500/15 text-pink-300 border-pink-500/20',
  'bg-amber-500/15 text-amber-300 border-amber-500/20',
  'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
]

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { projects, loading, fetchProjects } = usePortfolioStore(
    useShallow((s) => ({ projects: s.projects, loading: s.loading, fetchProjects: s.fetchProjects }))
  )

  useEffect(() => {
    if (projects.length === 0) fetchProjects()
  }, [fetchProjects, projects.length])

  const project = projects.find((p) => p.id === id)
  const allImages = project
    ? ([project.thumbnail_url, ...(project.images ?? [])].filter(Boolean) as string[])
    : []

  const [idx, setIdx] = useState(0)

  const prev = useCallback(() => setIdx((i) => (i - 1 + allImages.length) % allImages.length), [allImages.length])
  const next = useCallback(() => setIdx((i) => (i + 1) % allImages.length), [allImages.length])

  // Navegación por teclado
  useEffect(() => {
    if (allImages.length <= 1) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next, allImages.length])

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B1120]">
        <div className="max-w-5xl mx-auto px-4 pt-24 space-y-6">
          <LoadingSkeleton className="h-[55vh]" />
          <LoadingSkeleton className="h-48" />
        </div>
      </div>
    )
  }

  if (!loading && projects.length > 0 && !project) {
    return <Navigate to="/" replace />
  }

  if (!project) return null

  return (
    <div
      className="min-h-screen bg-[#0B1120] text-white"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}
    >
      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-50 rounded-2xl bg-[#0B1120]/90 backdrop-blur-md border border-white/10 shadow-xl shadow-black/30">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-end">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        {/* ── Galería de imágenes ───────────────────────────────────── */}
        {allImages.length > 0 ? (
          <div className="mb-10">
            {/* Imagen principal */}
            <div className="relative w-full bg-[#0A0A14] overflow-hidden" style={{ height: 'clamp(280px, 55vh, 680px)' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={allImages[idx]}
                  src={allImages[idx]}
                  alt={`${project.title} — imagen ${idx + 1}`}
                  className="w-full h-full object-contain"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>

              {/* Flechas */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full transition-colors cursor-pointer"
                    aria-label="Imagen anterior"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full transition-colors cursor-pointer"
                    aria-label="Imagen siguiente"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Contador */}
                  <span className="absolute top-4 right-4 px-3 py-1 text-xs bg-black/60 backdrop-blur-sm text-white/80 rounded-full tabular-nums">
                    {idx + 1} / {allImages.length}
                  </span>
                </>
              )}
            </div>

            {/* Tira de miniaturas */}
            {allImages.length > 1 && (
              <div className="flex gap-2 justify-center mt-3 px-4 flex-wrap">
                {allImages.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`relative rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 cursor-pointer ${
                      i === idx
                        ? 'ring-2 ring-violet-500 opacity-100'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                    style={{ width: 72, height: 52 }}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <img src={url} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Placeholder sin imágenes */
          <div className="w-full flex items-center justify-center mb-10 bg-[#0A0A14]" style={{ height: 'clamp(200px, 40vh, 400px)' }}>
            <svg className="w-20 h-20 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* ── Contenido ─────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {project.featured && (
              <span className="px-3 py-1 text-xs bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 text-white rounded-full font-semibold border border-violet-400/25">
                Destacado
              </span>
            )}
            {!project.published && (
              <span className="px-3 py-1 text-xs bg-slate-700/60 text-slate-400 rounded-full border border-white/10">
                No publicado
              </span>
            )}
          </div>

          {/* Título */}
          <motion.h1
            className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
          </motion.h1>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`px-3 py-1 text-xs rounded-full border font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Separador */}
          <div className="h-px bg-white/5 mb-8" />

          {/* Descripción completa */}
          <div className="mb-10">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Descripción</h2>
            <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Links prominentes */}
          {(project.preview_url || project.repo_url) && (
            <>
              <div className="h-px bg-white/5 mb-8" />
              <div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Links</h2>
                <div className="flex flex-wrap gap-3">
                  {project.preview_url && (
                    <a
                      href={project.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 hover:text-violet-200 rounded-xl font-medium text-sm transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Ver demo
                    </a>
                  )}
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl font-medium text-sm transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      Ver código
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-white/5">
        <Link to="/" className="text-slate-600 hover:text-slate-400 text-sm transition-colors cursor-pointer">
          ← Volver al portfolio
        </Link>
      </footer>
    </div>
  )
}
