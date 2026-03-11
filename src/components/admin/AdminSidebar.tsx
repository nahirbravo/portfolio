import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/profile', label: 'Perfil', end: false },
  { to: '/admin/projects', label: 'Proyectos', end: false },
  { to: '/admin/certifications', label: 'Certificaciones', end: false },
  { to: '/admin/skills', label: 'Skills', end: false },
]

export default function AdminSidebar() {
  const navigate = useNavigate()
  const signOut = useAuthStore((s) => s.signOut)

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <aside className="w-56 shrink-0 bg-[#0D0D14] border-r border-white/5 flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/5">
        <span className="text-sm font-semibold text-white">Admin Panel</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
