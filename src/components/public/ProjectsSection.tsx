import { motion } from 'framer-motion'
import type { Project } from '@/types'
import ProjectCard from './ProjectCard'

interface ProjectsSectionProps {
  projects: Project[]
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const published = projects.filter((p) => p.published)

  return (
    <section id="projects" className="relative py-24 px-4 overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex items-start gap-5 mb-14"
        >
          <span className="text-7xl font-black text-white/4 leading-none select-none mt-1" aria-hidden>01</span>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
              Proyectos
            </h2>
            <div className="h-0.5 w-14 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
          </div>
        </motion.div>

        {published.length === 0 ? (
          <p className="text-slate-600 text-center py-16">Los proyectos estarán disponibles pronto.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {published.map((project) => (
              <motion.div
                key={project.id}
                variants={item}
                className={project.featured ? 'md:col-span-2' : ''}
              >
                <ProjectCard project={project} featured={project.featured} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
