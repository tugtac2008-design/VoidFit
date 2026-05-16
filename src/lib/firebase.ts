import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCxwX0j_WRY4H3JQm3IWMTuJHL2n9IHtaY",
  authDomain: "voidfit-69668.firebaseapp.com",
  projectId: "voidfit-69668",
  storageBucket: "voidfit-69668.firebasestorage.app",
  messagingSenderId: "805816746840",
  appId: "1:805816746840:web:40059040a67852e20f5b2d",
  measurementId: "G-LFZB4LQGZ7"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
