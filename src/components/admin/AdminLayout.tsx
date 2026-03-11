import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { usePortfolioStore } from '@/stores/usePortfolioStore'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const fetchAll = usePortfolioStore((s) => s.fetchAll)

  // Carga todos los datos con sesión autenticada al entrar al panel admin.
  // La sesión autenticada bypasea el filtro RLS published=true del rol anon,
  // por eso el admin puede ver borradores y publicados.
  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on desktop, slide-in on mobile */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-40 md:z-auto flex flex-col h-screen transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center px-4 h-14 border-b border-white/5 bg-[#0D0D14]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Abrir menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 text-sm font-medium text-white">Admin Panel</span>
        </div>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
