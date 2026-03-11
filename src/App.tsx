import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'

const PublicPortfolio = lazy(() => import('@/pages/public/PublicPortfolio'))
const ProjectDetailPage = lazy(() => import('@/pages/public/ProjectDetailPage'))
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminProfilePage = lazy(() => import('@/pages/admin/AdminProfilePage'))
const AdminProjectsPage = lazy(() => import('@/pages/admin/AdminProjectsPage'))
const AdminCertificationsPage = lazy(() => import('@/pages/admin/AdminCertificationsPage'))
const AdminSkillsPage = lazy(() => import('@/pages/admin/AdminSkillsPage'))
const ProtectedRoute = lazy(() => import('@/components/shared/ProtectedRoute'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSkeleton className="h-screen" />}>
        <Routes>
          <Route path="/" element={<PublicPortfolio />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="certifications" element={<AdminCertificationsPage />} />
            <Route path="skills" element={<AdminSkillsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
