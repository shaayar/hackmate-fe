"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

export function useAuth() {
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError("")
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
      router.push("/dashboard")
      return true
    } catch (error) {
      setError("Failed to sign in with Google")
      console.error(error)
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
      router.push("/dashboard")
      return true
    } catch (error) {
      setError("Failed to sign in with GitHub")
      console.error(error)
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
      router.push("/dashboard")
      return true
    } catch (error) {
      setError("Failed to sign in")
      console.error(error)
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
      router.push("/dashboard")
      return true
    } catch (error) {
      setError("Failed to create an account")
      console.error(error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  return {
    user,
    error,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    logout,
  }
}

