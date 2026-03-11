import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Profile } from '@/types'
import ContactForm from './ContactForm'

interface ContactSectionProps {
  profile: Profile
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    if (!profile.email) return
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silently ignore clipboard errors
    }
  }

  return (
    <section id="contact" className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0f1629]/70 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[350px] bg-violet-600/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[250px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex items-start gap-5 mb-10"
        >
          <span className="text-7xl font-black text-white/4 leading-none select-none mt-1" aria-hidden>04</span>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
              Contacto
            </h2>
            <div className="h-0.5 w-14 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-slate-400 text-lg mb-8"
        >
          ¿Tenés un proyecto en mente? Escribime y charlamos.
        </motion.p>

        {/* Direct contact row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap items-center gap-3 mb-10"
        >
          {profile.email && (
            <button
              onClick={copyEmail}
              className="flex items-center gap-3 px-4 py-3 bg-[#111827] border border-white/8 hover:border-violet-500/30 rounded-xl text-sm transition-all group cursor-pointer"
            >
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-slate-300 group-hover:text-white transition-colors">{profile.email}</span>
              <span className={`text-xs font-medium transition-colors ${copied ? 'text-emerald-400' : 'text-slate-500 group-hover:text-violet-400'}`}>
                {copied ? '¡Copiado!' : 'Copiar'}
              </span>
            </button>
          )}

          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-[#111827] border border-white/8 hover:border-blue-500/30 rounded-xl text-sm text-slate-400 hover:text-blue-300 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          )}

          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-[#111827] border border-white/8 hover:border-white/20 rounded-xl text-sm text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  )
}
