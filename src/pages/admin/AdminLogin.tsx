import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useShallow } from 'zustand/shallow'
import { useAuthStore } from '@/stores/useAuthStore'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function AdminLogin() {
  const navigate = useNavigate()
  const { signIn, loading, session } = useAuthStore(
    useShallow((s) => ({
      signIn: s.signIn,
      loading: s.loading,
      session: s.session,
    }))
  )

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (session) navigate('/admin', { replace: true })
  }, [session, navigate])

  const onSubmit = async (data: FormData) => {
    try {
      await signIn(data.email, data.password)
      navigate('/admin', { replace: true })
    } catch {
      setError('root', { message: 'Credenciales inválidas' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-1">Panel Admin</h1>
          <p className="text-slate-500 text-sm">Ingresá con tu cuenta de Supabase</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="w-full bg-[#12121A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              className="w-full bg-[#12121A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {errors.root && (
            <p className="text-red-400 text-sm text-center">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
