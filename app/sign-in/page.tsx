"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"
import { NavBar } from "@/components/nav-bar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      toast({
        title: "Success",
        description: "You have been signed in successfully.",
      })
    } catch (error: any) {
      setError(error.message)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    try {
      await signInWithGoogle()
      toast({
        title: "Success",
        description: "You have been signed in with Google successfully.",
      })
    } catch (error: any) {
      setError(error.message)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    }
  }

  const handleGithubSignIn = async () => {
    setError(null)
    try {
      await signInWithGithub()
      toast({
        title: "Success",
        description: "You have been signed in with GitHub successfully.",
      })
    } catch (error: any) {
      setError(error.message)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto flex flex-col items-center justify-center space-y-6 pt-20">
        <h1 className="text-3xl font-bold">Sign In</h1>

        {error && (
          <Alert variant="destructive" className="max-w-md">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="flex w-full max-w-md flex-col space-y-2">
          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={loading}>
            Sign in with Google
          </Button>
          <Button onClick={handleGithubSignIn} variant="outline" className="w-full" disabled={loading}>
            Sign in with GitHub
          </Button>
        </div>

        <p className="text-sm">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

