import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import ParticipantHome from './pages/ParticipantHome'
import RatingPage from './pages/RatingPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminParticipantDetail from './pages/AdminParticipantDetail'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute><ParticipantHome /></ProtectedRoute>
          } />
          <Route path="/rate/:sessionId/:timing" element={
            <ProtectedRoute><RatingPage /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/participant/:uid" element={
            <ProtectedRoute adminOnly><AdminParticipantDetail /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
