import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import ParticipantHome from './pages/ParticipantHome'
import RatingPage from './pages/RatingPage'
import BaselineIntake from './pages/BaselineIntake'
import FinalReflection from './pages/FinalReflection'
import RelationalEnergyAssessment from './pages/RelationalEnergyAssessment'
import RelationalEnergyResults from './pages/RelationalEnergyResults'
import AdminDashboard from './pages/AdminDashboard'
import AdminParticipantDetail from './pages/AdminParticipantDetail'
import PostAssessment from './pages/PostAssessment'
import PresenceBoard from './pages/PresenceBoard'

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
          <Route path="/baseline" element={
            <ProtectedRoute><BaselineIntake /></ProtectedRoute>
          } />
          <Route path="/reflection" element={
            <ProtectedRoute><FinalReflection /></ProtectedRoute>
          } />
          <Route path="/assessment/relational-energy" element={
            <ProtectedRoute><RelationalEnergyAssessment /></ProtectedRoute>
          } />
          <Route path="/energy-results" element={
            <ProtectedRoute><RelationalEnergyResults /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/participant/:uid" element={
            <ProtectedRoute adminOnly><AdminParticipantDetail /></ProtectedRoute>
          } />
          <Route path="/post-assessment" element={
            <ProtectedRoute><PostAssessment /></ProtectedRoute>
          } />
          <Route path="/presence-board" element={
            <ProtectedRoute><PresenceBoard /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
