import { motion } from 'framer-motion'
import type { Certification } from '@/types'

interface CertificationsSectionProps {
  certifications: Certification[]
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const grouped = certifications.reduce<Record<string, Certification[]>>((acc, cert) => {
    const key = cert.category ?? 'Otros'
    if (!acc[key]) acc[key] = []
    acc[key].push(cert)
    return acc
  }, {})

  const categories = Object.keys(grouped)

  return (
    <section id="certifications" className="relative py-24 px-4 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[#0f1629]/80 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex items-start gap-5 mb-14"
        >
          <span className="text-7xl font-black text-white/4 leading-none select-none mt-1" aria-hidden>02</span>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
              Certificaciones
            </h2>
            <div className="h-0.5 w-14 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full" />
          </div>
        </motion.div>

        {categories.length === 0 ? (
          <p className="text-slate-600 text-center py-16">Las certificaciones estarán disponibles pronto.</p>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-sm font-semibold text-fuchsia-400 uppercase tracking-widest">
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ staggerChildren: 0.06 }}
                >
                  {grouped[category]?.map((cert) => (
                    <motion.article
                      key={cert.id}
                      variants={item}
                      className="group relative bg-[#111827] border border-white/6 hover:border-fuchsia-500/25 rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-fuchsia-500/5"
                    >
                      {cert.image_url && (
                        <div className="h-28 rounded-xl overflow-hidden bg-slate-800/50 flex items-center justify-center">
                          <img
                            src={cert.image_url}
                            alt={cert.title}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm leading-snug mb-1 group-hover:text-fuchsia-200 transition-colors">
                          {cert.title}
                        </h4>
                        <p className="text-slate-500 text-xs font-medium">{cert.institution}</p>
                        {cert.issued_at && (
                          <p className="text-slate-600 text-xs mt-1">{cert.issued_at}</p>
                        )}
                      </div>
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors cursor-pointer w-fit"
                        >
                          Ver certificado
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </motion.article>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
