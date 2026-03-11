import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

const TAG_COLORS = [
  'bg-violet-500/15 text-violet-300 border-violet-500/20',
  'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  'bg-pink-500/15 text-pink-300 border-pink-500/20',
  'bg-amber-500/15 text-amber-300 border-amber-500/20',
  'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
]

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const allImages = [project.thumbnail_url, ...(project.images ?? [])].filter(Boolean) as string[]
  const hasCarousel = allImages.length > 1

  const [idx, setIdx] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)

  const go = (dir: 1 | -1, e: React.MouseEvent) => {
    e.stopPropagation()
    setIsNavigating(true)
    setIdx((prev) => (prev + dir + allImages.length) % allImages.length)
  }

  const handleMouseLeave = () => setIsNavigating(false)

  return (
    <motion.article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#111827] hover:border-violet-500/35 transition-all duration-300 ${
        featured ? 'md:col-span-2' : ''
      }`}
      whileHover={isNavigating ? {} : { y: -6, boxShadow: '0 24px 48px -12px rgba(139,92,246,0.18)' }}
      transition={{ duration: 0.25 }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail / Carrusel */}
      <div
        className={`relative overflow-hidden ${featured ? 'h-60' : 'h-48'} bg-slate-800/60`}
      >
        {allImages.length > 0 ? (
          <img
            src={allImages[idx]}
            alt={`${project.title} — imagen ${idx + 1}`}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              !isNavigating ? 'group-hover:scale-105' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-[#0B1120]">
            <svg className="w-14 h-14 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {project.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 backdrop-blur-sm text-white rounded-full font-semibold border border-violet-400/25">
            Destacado
          </span>
        )}

        {/* Contador de imágenes */}
        {hasCarousel && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-xs bg-black/60 backdrop-blur-sm text-white/80 rounded-full tabular-nums">
            {idx + 1} / {allImages.length}
          </span>
        )}

        {/* Flechas de navegación — solo visibles en hover */}
        {hasCarousel && (
          <>
            <button
              type="button"
              onClick={(e) => go(-1, e)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/50 hover:bg-black/75 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              aria-label="Imagen anterior"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => go(1, e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/50 hover:bg-black/75 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              aria-label="Imagen siguiente"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {hasCarousel && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setIdx(i); setIsNavigating(true) }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  i === idx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#111827] to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-white font-bold text-base mb-2 line-clamp-1 group-hover:text-violet-300 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 5).map((tag, i) => (
              <span
                key={tag}
                className={`px-2 py-0.5 text-xs rounded-full border font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-4 pt-3 border-t border-white/5">
          <Link
            to={`/projects/${project.id}`}
            className="flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
          >
            Ver proyecto
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {project.preview_url && (
            <a
              href={project.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Demo
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Código
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
