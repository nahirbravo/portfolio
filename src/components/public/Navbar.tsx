import { useState, useEffect } from 'react'
import { useScrollTo } from '@/hooks/useScrollTo'

const NAV_LINKS = [
  { label: 'Inicio', id: 'hero' },
  { label: 'Proyectos', id: 'projects' },
  { label: 'Certificaciones', id: 'certifications' },
  { label: 'Skills', id: 'skills' },
  { label: 'Contacto', id: 'contact' },
]

export default function Navbar() {
  const scrollTo = useScrollTo()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (id: string) => {
    scrollTo(id)
    setOpen(false)
  }

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B1120]/90 backdrop-blur-md border border-white/10 shadow-xl shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-center">
        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleNav(link.id)}
                className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/6 transition-all cursor-pointer"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/6 transition-colors cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/8 px-4 py-3 bg-[#0B1120]/95 rounded-b-2xl">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNav(link.id)}
                  className="w-full text-left text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/6 transition-all cursor-pointer"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
