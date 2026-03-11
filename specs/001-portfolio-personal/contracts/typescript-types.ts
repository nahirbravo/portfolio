/**
 * Portfolio Personal — TypeScript Types
 * Feature: 001-portfolio-personal
 * Date: 2026-03-11
 *
 * Tipos derivados directamente del schema de Supabase.
 * Copiar a: src/types/index.ts
 */

// ============================================================
// Database entities (mirrors Supabase tables)
// ============================================================

export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  email: string
  linkedin_url: string | null
  github_url: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  preview_url: string | null
  repo_url: string | null
  tags: string[]
  thumbnail_url: string | null
  featured: boolean
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface Skill {
  id: string
  name: string
  category: string
  icon: string | null
  level: SkillLevel
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  title: string
  institution: string
  issued_at: string            // ISO date string "YYYY-MM-DD"
  credential_url: string | null
  image_url: string | null
  category: string
  sort_order: number
  created_at: string
  updated_at: string
}

// ============================================================
// Form input types (used with React Hook Form + Zod)
// ============================================================

export type ProfileFormData = Omit<Profile, 'id' | 'created_at' | 'updated_at'>

export type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'> & {
  thumbnail_file?: File | null    // for upload — not stored in DB
}

export type CertificationFormData = Omit<Certification, 'id' | 'created_at' | 'updated_at'> & {
  image_file?: File | null         // for upload
}

export type SkillFormData = Omit<Skill, 'id' | 'created_at' | 'updated_at'>

// ============================================================
// UI / derived types
// ============================================================

/** Skill agrupado por categoría para la vista pública */
export interface SkillsByCategory {
  category: string
  skills: Skill[]
}

/** Certificación agrupada por categoría */
export interface CertificationsByCategory {
  category: string
  certifications: Certification[]
}

/** Estado de un formulario async */
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

/** Estado de carga de datos */
export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// ============================================================
// Supabase Database type helper (optional — for typed client)
// ============================================================

/**
 * Database shape para usar con:
 * createClient<Database>(url, key)
 *
 * Generado manualmente aquí — en proyectos más grandes,
 * usar: `supabase gen types typescript --linked > src/types/supabase.ts`
 */
export interface Database {
  public: {
    Tables: {
      profile: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
      }
      certifications: {
        Row: Certification
        Insert: Omit<Certification, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Certification, 'id' | 'created_at' | 'updated_at'>>
      }
      skills: {
        Row: Skill
        Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
