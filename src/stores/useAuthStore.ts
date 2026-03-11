import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  initialized: boolean
}

interface AuthActions {
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    // 1. Lectura inicial de sesión desde localStorage (sin network call si no expiró)
    const { data: { session } } = await supabase.auth.getSession()
    set({ session, user: session?.user ?? null, initialized: true })

    // 2. Escuchar cambios de sesión — callback DEBE ser sincrónico (research.md Decision 3)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null }) // sin await
    })
  },

  signIn: async (email, password) => {
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ session: null, user: null })
  },
}))

export const useAuth = () =>
  useAuthStore(
    useShallow((s) => ({
      session: s.session,
      user: s.user,
      loading: s.loading,
      initialized: s.initialized,
    }))
  )
