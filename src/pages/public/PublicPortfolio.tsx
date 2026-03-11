import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'
import { usePortfolioStore } from '@/stores/usePortfolioStore'
import { useScrollTo } from '@/hooks/useScrollTo'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import Navbar from '@/components/public/Navbar'
import HeroSection from '@/components/public/HeroSection'
import ProjectsSection from '@/components/public/ProjectsSection'
import CertificationsSection from '@/components/public/CertificationsSection'
import SkillsSection from '@/components/public/SkillsSection'
import ContactSection from '@/components/public/ContactSection'

export default function PublicPortfolio() {
  const { profile, projects, certifications, skills, loading, error, fetchAll } = usePortfolioStore(
    useShallow((s) => ({
      profile: s.profile,
      projects: s.projects,
      certifications: s.certifications,
      skills: s.skills,
      loading: s.loading,
      error: s.error,
      fetchAll: s.fetchAll,
    }))
  )

  const scrollTo = useScrollTo()

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-[#0B1120]">
        <div className="max-w-6xl mx-auto px-4 pt-24 space-y-8">
          <LoadingSkeleton className="h-96" />
          <LoadingSkeleton className="h-64" />
          <LoadingSkeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-slate-400 text-lg">No se pudo cargar el contenido.</p>
          <p className="text-slate-600 text-sm mt-2">Por favor, intentá nuevamente.</p>
          <button
            onClick={() => fetchAll()}
            className="mt-6 px-4 py-2 border border-white/10 text-slate-400 hover:text-white rounded-lg text-sm transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#0B1120] text-white"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}
    >
      <Navbar />
      {profile && (
        <HeroSection profile={profile} onViewProjects={() => scrollTo('projects')} />
      )}
      <ProjectsSection projects={projects} />
      <CertificationsSection certifications={certifications} />
      <SkillsSection skills={skills} />
      {profile && <ContactSection profile={profile} />}

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5">
        <p className="text-slate-700 text-sm">{profile?.name ?? 'Portfolio'} © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
