"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  type User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth, googleProvider, githubProvider } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAuthError = (error: any) => {
    console.error("Authentication error:", error)

    if (error.code === "auth/unauthorized-domain") {
      return "This domain is not authorized for authentication. Please ensure you're accessing the application from an authorized domain."
    }

    if (error.code === "auth/popup-blocked") {
      return "The sign-in popup was blocked by your browser. Please allow popups for this site and try again."
    }

    if (error.code === "auth/popup-closed-by-user") {
      return "The sign-in popup was closed before authentication could complete."
    }

    if (error.code === "auth/cancelled-popup-request") {
      return "Multiple popup requests were made. Please try again."
    }

    return error.message || "An unexpected authentication error occurred."
  }

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log("User signed up successfully:", userCredential.user.email)
      router.push("/dashboard")
    } catch (error: any) {
      handleAuthError(error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("User signed in successfully:", userCredential.user.email)
      router.push("/dashboard")
    } catch (error: any) {
      handleAuthError(error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log("Attempting Google sign-in...")
      const result = await signInWithPopup(auth, googleProvider)
      console.log("Google sign-in successful:", result.user.email)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Detailed Google sign-in error:", error)
      const errorMessage = handleAuthError(error)
      throw new Error(errorMessage)
    }
  }

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider)
      console.log("User signed in with GitHub successfully:", result.user.email)
      router.push("/dashboard")
    } catch (error: any) {
      handleAuthError(error)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      console.log("User signed out successfully")
      router.push("/")
    } catch (error: any) {
      handleAuthError(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithGithub,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

