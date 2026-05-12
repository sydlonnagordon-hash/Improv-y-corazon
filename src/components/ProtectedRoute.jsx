import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <div className="page"><p>Loading…</p></div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/" replace />

  return children
}
