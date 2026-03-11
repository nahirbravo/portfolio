import { motion } from 'framer-motion'
import type { Skill } from '@/types'

interface SkillsSectionProps {
  skills: Skill[]
}

const LEVEL_DOTS: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
}

const CATEGORY_ACCENT: Record<string, { dot: string; card: string; border: string; text: string }> = {
  Frontend:  { dot: 'bg-violet-400',  card: 'hover:border-violet-500/30',  border: 'border-white/6', text: 'text-violet-400' },
  Backend:   { dot: 'bg-cyan-400',    card: 'hover:border-cyan-500/30',    border: 'border-white/6', text: 'text-cyan-400' },
  Mobile:    { dot: 'bg-pink-400',    card: 'hover:border-pink-500/30',    border: 'border-white/6', text: 'text-pink-400' },
  DevOps:    { dot: 'bg-amber-400',   card: 'hover:border-amber-500/30',   border: 'border-white/6', text: 'text-amber-400' },
  Tools:     { dot: 'bg-emerald-400', card: 'hover:border-emerald-500/30', border: 'border-white/6', text: 'text-emerald-400' },
  Database:  { dot: 'bg-blue-400',    card: 'hover:border-blue-500/30',    border: 'border-white/6', text: 'text-blue-400' },
  Cloud:     { dot: 'bg-sky-400',     card: 'hover:border-sky-500/30',     border: 'border-white/6', text: 'text-sky-400' },
}

const DEFAULT_ACCENT = { dot: 'bg-slate-400', card: 'hover:border-slate-500/30', border: 'border-white/6', text: 'text-slate-400' }

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category
    if (!acc[key]) acc[key] = []
    acc[key].push(skill)
    return acc
  }, {})

  const categories = Object.keys(grouped)

  return (
    <section id="skills" className="relative py-24 px-4 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex items-start gap-5 mb-14"
        >
          <span className="text-7xl font-black text-white/4 leading-none select-none mt-1" aria-hidden>03</span>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
              Stack
            </h2>
            <div className="h-0.5 w-14 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" />
          </div>
        </motion.div>

        {categories.length === 0 ? (
          <p className="text-slate-600 text-center py-16">El stack tecnológico estará disponible pronto.</p>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => {
              const accent = CATEGORY_ACCENT[category] ?? DEFAULT_ACCENT
              return (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`w-2 h-2 rounded-full ${accent.dot}`} />
                    <h3 className={`text-sm font-semibold uppercase tracking-widest ${accent.text}`}>
                      {category}
                    </h3>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>

                  <motion.div
                    className="flex flex-wrap gap-2.5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ staggerChildren: 0.04 }}
                  >
                    {grouped[category]?.map((skill) => {
                      const dots = LEVEL_DOTS[skill.level] ?? 2
                      return (
                        <motion.div
                          key={skill.id}
                          variants={{
                            hidden: { opacity: 0, scale: 0.85 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                          }}
                          className={`flex items-center gap-2.5 px-3.5 py-2 bg-[#111827] border ${accent.border} ${accent.card} rounded-xl transition-all duration-200 cursor-default`}
                        >
                          {skill.icon && (
                            <span className="text-base leading-none">{skill.icon}</span>
                          )}
                          <span className="text-sm text-slate-200 font-medium">{skill.name}</span>
                          {/* Level dots */}
                          <div className="flex items-center gap-0.5 ml-1">
                            {[1, 2, 3, 4].map((n) => (
                              <span
                                key={n}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                  n <= dots ? accent.dot : 'bg-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
