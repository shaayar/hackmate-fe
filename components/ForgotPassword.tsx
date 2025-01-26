import { useState } from "react"
import { useAuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { forgotPassword } = useAuthContext()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await forgotPassword(email)
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for instructions to reset your password.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-white/10 text-white placeholder-gray-300"
      />
      <Button
        type="submit"
        className="w-full bg-white text-purple-600 hover:bg-gray-200 transition-colors"
        disabled={loading}
      >
        {loading ? "Sending..." : "Reset Password"}
      </Button>
    </form>
  )
}

