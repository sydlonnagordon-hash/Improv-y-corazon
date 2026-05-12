import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD4ZwPzfwVOO6KN8GeomEK5LRA9frFpNbM",
  authDomain: "improvycorazon-5ff8b.firebaseapp.com",
  projectId: "improvycorazon-5ff8b",
  storageBucket: "improvycorazon-5ff8b.firebasestorage.app",
  messagingSenderId: "79695963774",
  appId: "1:79695963774:web:52c0bc9792a471f504da2f",
  measurementId: "G-PV6RDD9G2D",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
