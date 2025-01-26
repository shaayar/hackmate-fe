"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { user, updateProfile } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile({ displayName, email })
      toast({
        title: "Settings updated",
        description: "Your profile has been successfully updated.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-white">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-white/10 text-white placeholder-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 text-white placeholder-gray-300"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-white text-purple-600 hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

