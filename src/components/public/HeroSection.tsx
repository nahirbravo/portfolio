import { motion } from 'framer-motion'
import type { Profile } from '@/types'

interface HeroSectionProps {
  profile: Profile
  onViewProjects: () => void
}

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const STACK = [
  { name: 'React / Next.js', dot: 'bg-cyan-400' },
  { name: 'TypeScript',      dot: 'bg-blue-400' },
  { name: 'Node.js',         dot: 'bg-emerald-400' },
  { name: 'React Native',    dot: 'bg-violet-400' },
  { name: 'Supabase',        dot: 'bg-emerald-500' },
  { name: 'Tailwind CSS',    dot: 'bg-sky-400' },
]

export default function HeroSection({ profile, onViewProjects }: HeroSectionProps) {
  const nameParts = profile.name.split(' ')
  const firstName = nameParts[0] ?? profile.name
  const lastName = nameParts.slice(1).join(' ')

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-violet-600/12 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-fuchsia-500/8 rounded-full blur-[60px]" />
      </div>

      {/* ── Decoración izquierda: code card ───────────────────────── */}
      <motion.div
        className="hidden xl:block absolute left-[3%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
        initial={{ opacity: 0, x: -40, rotate: -6 }}
        animate={{ opacity: 1, x: 0, rotate: -6 }}
        transition={{ delay: 0.8, duration: 0.7, ease: 'easeOut' }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-56 bg-[#0D1117]/90 backdrop-blur-sm border border-white/8 rounded-xl overflow-hidden shadow-2xl shadow-black/40"
        >
          {/* macOS-style title bar */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/5 bg-[#0A0A14]/80">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="text-slate-600 text-[10px] ml-2 font-mono">dev.ts</span>
          </div>
          {/* Syntax-colored code */}
          <div className="px-4 py-3 font-mono text-[11px] leading-relaxed space-y-0.5">
            <p>
              <span className="text-violet-400">const</span>{' '}
              <span className="text-cyan-300">dev</span>{' '}
              <span className="text-white/40">=</span>{' '}
              <span className="text-amber-400/80">{'{'}</span>
            </p>
            <p className="pl-3">
              <span className="text-slate-500">name:</span>{' '}
              <span className="text-emerald-400">"{firstName}"</span>
              <span className="text-slate-600">,</span>
            </p>
            <p className="pl-3">
              <span className="text-slate-500">role:</span>{' '}
              <span className="text-emerald-400">
                "{profile.title.split(' ').slice(0, 2).join(' ')}"
              </span>
              <span className="text-slate-600">,</span>
            </p>
            <p className="pl-3">
              <span className="text-slate-500">open:</span>{' '}
              <span className="text-violet-400">true</span>
              <span className="text-slate-600">,</span>
            </p>
            <p className="pl-3">
              <span className="text-slate-500">coffee:</span>{' '}
              <span className="text-violet-400">Infinity</span>
            </p>
            <p><span className="text-amber-400/80">{'}'}</span></p>
            <p className="pt-1.5">
              <span className="text-slate-600 italic">{'// always learning'}</span>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Decoración derecha: tech stack card ───────────────────── */}
      <motion.div
        className="hidden xl:block absolute right-[3%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
        initial={{ opacity: 0, x: 40, rotate: 5 }}
        animate={{ opacity: 1, x: 0, rotate: 5 }}
        transition={{ delay: 0.9, duration: 0.7, ease: 'easeOut' }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="w-52 bg-[#0D1117]/90 backdrop-blur-sm border border-white/8 rounded-xl p-4 shadow-2xl shadow-black/40"
        >
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-3.5">
            Stack
          </p>
          <div className="space-y-2.5">
            {STACK.map((t) => (
              <div key={t.name} className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.dot}`} />
                <span className="text-slate-400 text-xs">{t.name}</span>
              </div>
            ))}
          </div>

          {/* Mini progress decorativo */}
          <div className="mt-4 pt-3.5 border-t border-white/5 space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-600 mb-1">
              <span>commits today</span>
              <span className="text-emerald-500">+12</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Contenido central ─────────────────────────────────────── */}
      <motion.div
        className="relative max-w-2xl mx-auto w-full py-16 text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-full mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">Disponible para proyectos</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-[0.95]"
        >
          <span className="text-white block">{firstName}</span>
          {lastName && (
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent block">
              {lastName}
            </span>
          )}
        </motion.h1>

        {/* Title */}
        <motion.p
          variants={fadeInUp}
          className="text-slate-400 text-lg md:text-xl font-medium mb-5"
        >
          {profile.title}
        </motion.p>

        {/* Bio */}
        <motion.p
          variants={fadeInUp}
          className="text-slate-500 text-base leading-relaxed max-w-xl mx-auto mb-8"
        >
          {profile.bio}
        </motion.p>

        {/* Social buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap items-center gap-2.5 justify-center mb-8"
        >
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-white/8 hover:border-white/15 rounded-xl text-slate-300 hover:text-white text-sm font-medium transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-blue-900/30 border border-white/8 hover:border-blue-500/30 rounded-xl text-slate-300 hover:text-blue-300 text-sm font-medium transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-violet-900/25 border border-white/8 hover:border-violet-500/30 rounded-xl text-slate-300 hover:text-violet-300 text-sm font-medium transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeInUp}>
          <button
            onClick={onViewProjects}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 cursor-pointer"
          >
            Ver proyectos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          variants={fadeInUp}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-xs tracking-widest uppercase">scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
