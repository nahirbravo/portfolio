// ============================================================
// Portfolio Personal — TypeScript Types
// Derived from: specs/001-portfolio-personal/contracts/typescript-types.ts
// ============================================================

// ── Database entities ─────────────────────────────────────────

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
  images: string[]   // galería adicional (no incluye thumbnail_url)
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
  issued_at: string | null    // año ("2023") o null si no se conoce
  credential_url: string | null
  image_url: string | null
  category: string
  sort_order: number
  created_at: string
  updated_at: string
}

// ── Form input types ──────────────────────────────────────────

export type ProfileFormData = Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
  avatar_file?: File | null
}

export type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'> & {
  thumbnail_file?: File | null
}

export type CertificationFormData = Omit<Certification, 'id' | 'created_at' | 'updated_at'> & {
  image_file?: File | null
}

export type SkillFormData = Omit<Skill, 'id' | 'created_at' | 'updated_at'>

// ── UI / derived types ────────────────────────────────────────

export interface SkillsByCategory {
  category: string
  skills: Skill[]
}

export interface CertificationsByCategory {
  category: string
  certifications: Certification[]
}

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// ── Supabase Database type ────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      certifications: {
        Row: Certification
        Insert: Omit<Certification, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Certification, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      skills: {
        Row: Skill
        Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
