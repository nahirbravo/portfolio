import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { supabase } from '@/lib/supabase'
import type { Profile, Project, Certification, Skill } from '@/types'

interface PortfolioState {
  profile: Profile | null
  projects: Project[]
  certifications: Certification[]
  skills: Skill[]
  loading: boolean
  error: string | null
}

interface PortfolioActions {
  fetchProfile: () => Promise<void>
  fetchProjects: () => Promise<void>
  fetchCertifications: () => Promise<void>
  fetchSkills: () => Promise<void>
  fetchAll: () => Promise<void>
}

type PortfolioStore = PortfolioState & PortfolioActions

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  profile: null,
  projects: [],
  certifications: [],
  skills: [],
  loading: false,
  error: null,

  fetchProfile: async () => {
    // order + limit(1) evita el error PGRST116 si existen filas duplicadas
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) {
      set({ error: 'Error al cargar el perfil' })
      return
    }
    set({ profile: data })
  },

  fetchProjects: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) {
      set({ error: 'Error al cargar proyectos' })
      return
    }
    set({ projects: data ?? [] })
  },

  fetchCertifications: async () => {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) {
      set({ error: 'Error al cargar certificaciones' })
      return
    }
    set({ certifications: data ?? [] })
  },

  fetchSkills: async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) {
      set({ error: 'Error al cargar skills' })
      return
    }
    set({ skills: data ?? [] })
  },

  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const [profileRes, projectsRes, certsRes, skillsRes] = await Promise.all([
        supabase.from('profile').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('certifications').select('*').order('sort_order', { ascending: true }),
        supabase.from('skills').select('*').order('sort_order', { ascending: true }),
      ])

      // El perfil se trata por separado: si falla (ej. filas duplicadas), el resto igual carga
      if (projectsRes.error) throw new Error(projectsRes.error.message)
      if (certsRes.error) throw new Error(certsRes.error.message)
      if (skillsRes.error) throw new Error(skillsRes.error.message)

      set({
        profile: profileRes.error ? null : profileRes.data,
        projects: projectsRes.data ?? [],
        certifications: certsRes.data ?? [],
        skills: skillsRes.data ?? [],
        loading: false,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el contenido'
      set({ error: message, loading: false })
    }
  },
}))

/** Selector con useShallow para evitar re-renders innecesarios en Zustand v5 */
export const usePortfolioData = () =>
  usePortfolioStore(
    useShallow((s) => ({
      profile: s.profile,
      projects: s.projects,
      certifications: s.certifications,
      skills: s.skills,
      loading: s.loading,
      error: s.error,
    }))
  )
