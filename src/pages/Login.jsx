import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          role: 'participant',
          createdAt: new Date(),
        })
      }
      navigate('/')
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>🌿</div>
        <h1>Corazón Presence Method</h1>
        <p className={styles.sub}>Track your growth, session by session.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <div className="field">
              <label className="label">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
                required
              />
            </div>
          )}
          <div className="field">
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          className={styles.toggle}
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
