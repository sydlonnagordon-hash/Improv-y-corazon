import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './NavBar.module.css'

export default function NavBar() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut(auth)
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav className={styles.nav}>
      <span className={styles.logo}>Corazón</span>
      <div className={styles.right}>
        {profile?.role === 'admin' && (
          <button className={styles.link} onClick={() => navigate('/admin')}>Admin</button>
        )}
        <button className={styles.link} onClick={() => navigate('/')}>My Progress</button>
        <button className={styles.signout} onClick={handleSignOut}>Sign out</button>
      </div>
    </nav>
  )
}
