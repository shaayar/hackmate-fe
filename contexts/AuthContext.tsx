"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  signInWithPopup,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as updateProfileFirebase,
  sendPasswordResetEmail,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

type AuthContextType = {
  user: User | null
  error: string
  loading: boolean
  signInWithGoogle: () => Promise<boolean>
  signInWithGithub: () => Promise<boolean>
  signInWithEmail: (email: string, password: string) => Promise<boolean>
  signUpWithEmail: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (data: { displayName?: string; email?: string }) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  error: "",
  loading: true,
  signInWithGoogle: async () => false,
  signInWithGithub: async () => false,
  signInWithEmail: async () => false,
  signUpWithEmail: async () => false,
  logout: async () => {},
  updateProfile: async () => {},
  forgotPassword: async () => {},
})

export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user)
        setLoading(false)
      },
      (error) => {
        console.error("Auth state change error:", error)
        setError(error.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError("")
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      setUser(result.user)
      return true
    } catch (error: any) {
      console.error("Google sign in error:", error)
      setError(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signInWithGithub = async () => {
    try {
      setError("")
      setLoading(true)
      const provider = new GithubAuthProvider()
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
      return true
    } catch (error: any) {
      console.error("GitHub sign in error:", error)
      setError(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      setUser(result.user)
      return true
    } catch (error: any) {
      console.error("Email sign in error:", error)
      setError(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      setUser(result.user)
      return true
    } catch (error: any) {
      console.error("Email sign up error:", error)
      setError(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError("")
      setLoading(true)
      await signOut(auth)
      setUser(null)
    } catch (error: any) {
      console.error("Logout error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: { displayName?: string; email?: string }) => {
    if (!user) return

    try {
      await user.updateProfile(data)
      setUser({ ...user, ...data })
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      console.error("Password reset error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loading,
        signInWithGoogle,
        signInWithGithub,
        signInWithEmail,
        signUpWithEmail,
        logout,
        updateProfile,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

