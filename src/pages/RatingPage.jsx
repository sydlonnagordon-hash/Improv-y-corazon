import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import RatingForm from './RatingForm'

export default function RatingPage() {
  const { sessionId, timing } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [alreadyRated, setAlreadyRated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [sessionSnap, ratingsSnap] = await Promise.all([
        getDoc(doc(db, 'sessions', sessionId)),
        getDocs(query(
          collection(db, 'ratings'),
          where('userId', '==', user.uid),
          where('sessionId', '==', sessionId),
          where('timing', '==', timing),
        )),
      ])
      setSession(sessionSnap.exists() ? { id: sessionSnap.id, ...sessionSnap.data() } : null)
      setAlreadyRated(!ratingsSnap.empty)
      setLoading(false)
    }
    load()
  }, [sessionId, timing, user.uid])

  if (loading) return <div className="page"><p>Loading…</p></div>
  if (!session) return <div className="page"><p>Session not found.</p></div>
  if (alreadyRated) return (
    <div className="page">
      <div className="card">
        <p style={{ color: 'var(--green-dark)', fontWeight: 600, marginBottom: 12 }}>
          You already submitted your {timing === 'pre' ? 'before' : 'after'}-session rating for {session.label}.
        </p>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Back to home</button>
      </div>
    </div>
  )

  return (
    <RatingForm
      timing={timing}
      sessionId={sessionId}
      sessionLabel={session.label}
    />
  )
}
