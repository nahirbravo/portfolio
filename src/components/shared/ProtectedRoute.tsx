import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { useAuthStore } from '@/stores/useAuthStore'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'

interface ProtectedRouteProps {
  children?: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, initialized, initialize } = useAuthStore(
    useShallow((s) => ({
      session: s.session,
      initialized: s.initialized,
      initialize: s.initialize,
    }))
  )

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  if (!initialized) {
    return <LoadingSkeleton className="h-screen" />
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
