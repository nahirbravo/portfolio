import { Link } from 'react-router-dom'

const CARDS = [
  { to: '/admin/projects', label: 'Proyectos', description: 'Gestionar proyectos del portfolio', color: 'cyan' },
  { to: '/admin/profile', label: 'Perfil', description: 'Editar información personal', color: 'violet' },
  { to: '/admin/certifications', label: 'Certificaciones', description: 'Gestionar cursos y certificados', color: 'violet' },
  { to: '/admin/skills', label: 'Skills', description: 'Gestionar stack tecnológico', color: 'cyan' },
]

const COLOR = {
  cyan: 'border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/5',
  violet: 'border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/5',
}

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Bienvenido</h1>
      <p className="text-slate-500 text-sm mb-8">Seleccioná una sección para gestionar contenido.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        {CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={`block p-5 bg-[#12121A] border rounded-xl transition-all ${COLOR[card.color as keyof typeof COLOR]}`}
          >
            <h2 className="text-white font-semibold mb-1">{card.label}</h2>
            <p className="text-slate-500 text-sm">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
