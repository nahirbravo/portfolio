import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { usePortfolioStore } from '@/stores/usePortfolioStore'
import type {
  ProfileFormData,
  ProjectFormData,
  CertificationFormData,
  SkillFormData,
} from '@/types'

interface AdminActions {
  // Profile
  updateProfile: (id: string | undefined, data: Omit<ProfileFormData, 'avatar_file'> & { avatar_url?: string | null }) => Promise<void>

  // Projects
  createProject: (data: Omit<ProjectFormData, 'thumbnail_file'> & { thumbnail_url?: string | null }) => Promise<void>
  updateProject: (id: string, data: Omit<ProjectFormData, 'thumbnail_file'> & { thumbnail_url?: string | null }) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  togglePublished: (id: string, published: boolean) => Promise<void>

  // Certifications
  createCertification: (data: Omit<CertificationFormData, 'image_file'> & { image_url?: string | null }) => Promise<void>
  updateCertification: (id: string, data: Omit<CertificationFormData, 'image_file'> & { image_url?: string | null }) => Promise<void>
  deleteCertification: (id: string) => Promise<void>

  // Skills
  createSkill: (data: SkillFormData) => Promise<void>
  updateSkill: (id: string, data: SkillFormData) => Promise<void>
  deleteSkill: (id: string) => Promise<void>
}

export const useAdminStore = create<AdminActions>(() => ({
  // ── Profile ────────────────────────────────────────────────────

  updateProfile: async (id, data) => {
    if (id) {
      // Actualizar fila existente por id
      const { error } = await supabase.from('profile').update({ ...data }).eq('id', id)
      if (error) throw new Error(error.message)
    } else {
      // Primera vez: no hay perfil en DB → insertar
      const { error } = await supabase.from('profile').insert({ ...data })
      if (error) throw new Error(error.message)
    }
    await usePortfolioStore.getState().fetchProfile()
  },

  // ── Projects ───────────────────────────────────────────────────

  createProject: async (data) => {
    const { thumbnail_url, images, ...rest } = data
    const { error } = await supabase.from('projects').insert({
      ...rest,
      thumbnail_url: thumbnail_url ?? null,
      images: images ?? [],
    })
    if (error) throw new Error(error.message)
    await usePortfolioStore.getState().fetchProjects()
  },

  updateProject: async (id, data) => {
    const { thumbnail_url, images, ...rest } = data
    const { error } = await supabase
      .from('projects')
      .update({ ...rest, thumbnail_url: thumbnail_url ?? null, images: images ?? [] })
      .eq('id', id)
    if (error) throw new Error(error.message)
    await usePortfolioStore.getState().fetchProjects()
  },

  deleteProject: async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw new Error(error.message)
    await usePortfolioStore.getState().fetchProjects()
  },

  togglePublished: async (id, published) => {
    const { error } = await supabase.from('projects').update({ published }).eq('id', id)
    if (error) throw new Error(error.message)
    await usePortfolioStore.getState().fetchProjects()
  },

  // ── Certifications ─────────────────────────────────────────────

  createCertification: async (data) => {
    const { image_url, ...rest } = data
    const { error } = await supabase.from('certifications').insert({ ...rest, image_url: image_url ?? null })
    if (error) throw new Error(error.message)
    await usePortfolioStore.getState().fetchCertifications()
  },

  updateCertification: async (id, data) => {
    const { image_url, ...rest } = data
    const { error } = await supabase
      .from('certifications')
      .update({ ...rest, image_url: image_url ?? null })
      .eq('id', id)
    if (error) throw new Error(error.message)
    await usePortfolioStore.getState().fetchCertifications()
  },

  deleteCertification: async (id) => {
    const { error } = await supabase.from('certifications').delete().eq('id', id)
    if (error) throw new Error(error.message)
    await usePortfolioStore.getState().fetchCertifications()
  },

  // ── Skills ─────────────────────────────────────────────────────

  createSkill: async (data) => {
    const { error } = await supabase.from('skills').insert({ ...data })
    if (error) throw new Error(error.message)
    await usePortfolioStore.getState().fetchSkills()
  },

  updateSkill: async (id, data) => {
    const { error } = await supabase.from('skills').update({ ...data }).eq('id', id)
    if (error) throw new Error(error.message)
    await usePortfolioStore.getState().fetchSkills()
  },

  deleteSkill: async (id) => {
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) throw new Error(error.message)
    await usePortfolioStore.getState().fetchSkills()
  },
}))
