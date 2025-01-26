"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Github, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthContext } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { error, loading, signUpWithEmail, signInWithGoogle, signInWithGithub } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()

  const showSuccessToast = () => {
    toast({
      variant: "success",
      title: (
        <div className="flex items-center">
          <Check className="mr-2 h-4 w-4" /> Account Created
        </div>
      ),
      description: "Your account has been successfully created!",
    })
  }

  const showErrorToast = (message: string) => {
    toast({
      variant: "destructive",
      title: (
        <div className="flex items-center">
          <AlertCircle className="mr-2 h-4 w-4" /> Sign Up Failed
        </div>
      ),
      description: message,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await signUpWithEmail(email, password)
    if (success) {
      showSuccessToast()
      router.push("/dashboard")
    } else {
      showErrorToast(error || "Failed to create account")
    }
  }

  const handleGoogleSignIn = async () => {
    const success = await signInWithGoogle()
    if (success) {
      showSuccessToast()
      router.push("/dashboard")
    } else {
      showErrorToast(error || "Failed to sign up with Google")
    }
  }

  const handleGithubSignIn = async () => {
    const success = await signInWithGithub()
    if (success) {
      showSuccessToast()
      router.push("/dashboard")
    } else {
      showErrorToast(error || "Failed to sign up with GitHub")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md glass-effect">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-white text-center">Create an account</CardTitle>
          <CardDescription className="text-gray-200 text-center">Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleGithubSignIn}
              disabled={loading}
              className="bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-white">Or continue with</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 text-white placeholder-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 text-white placeholder-gray-300"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-white text-purple-600 hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full text-gray-200">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-white hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

