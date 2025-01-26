import { initializeApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAhZgHaH_3UBmK8Wl4rlLhbVO7FJoO3IME",
  authDomain: "hackmate-d6801.firebaseapp.com",
  projectId: "hackmate-d6801",
  storageBucket: "hackmate-d6801.firebasestorage.app",
  messagingSenderId: "289822377530",
  appId: "1:289822377530:web:e71304d1be83f9870f5703",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export { auth, googleProvider }

