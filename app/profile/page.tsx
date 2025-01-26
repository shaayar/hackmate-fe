"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Github, Linkedin, Twitter, Instagram, Facebook, Globe } from "lucide-react"
import type { UserProfile } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const SKILL_SUGGESTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "AWS",
  "Firebase",
  "MongoDB",
  "SQL",
  "UI/UX Design",
  "Product Management",
  "DevOps",
  "Machine Learning",
  "Data Science",
]

export default function ProfilePage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    uid: "",
    displayName: "",
    email: "",
    bio: "",
    skills: [],
    experience: "",
    socialLinks: {},
    availability: "available",
    isOnline: true,
    lastActive: new Date(),
  })
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        // Initialize with user data from auth while we fetch the full profile
        setProfile((prev) => ({
          ...prev,
          uid: user.uid,
          displayName: user.displayName || "",
          email: user.email || "",
        }))

        const response = await fetch(`/api/users/${user.uid}`)
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, router])

  const handleAddSkill = (skill: string) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
    }
    setNewSkill("")
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleSocialLinkChange = (platform: keyof typeof socialIcons, value: string) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch(`/api/users/${user?.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Show success message or notification here
    } catch (error) {
      console.error("Error saving profile:", error)
      // Show error message or notification here
    } finally {
      setSaving(false)
    }
  }

  const handleAvailabilityChange = async (value: string) => {
    try {
      const response = await fetch(`/api/users/${user?.uid}/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user?.getIdToken()}`,
        },
        body: JSON.stringify({ availability: value }),
      })

      if (response.ok) {
        setProfile((prev) => ({ ...prev, availability: value as UserProfile["availability"] }))
        toast({
          title: "Availability Updated",
          description: "Your availability status has been updated successfully.",
          variant: "success",
        })
      } else {
        throw new Error("Failed to update availability")
      }
    } catch (error) {
      console.error("Error updating availability:", error)
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">Your Profile</CardTitle>
            <CardDescription className="text-gray-200">Complete your profile to find the perfect team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-white">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(e) => setProfile((prev) => ({ ...prev, displayName: e.target.value }))}
                className="bg-white/10 text-white placeholder-gray-300"
                placeholder="Your display name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                className="bg-white/10 text-white placeholder-gray-300"
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-white">
                Skills
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-white/20 text-white">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 hover:text-red-400">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="bg-white/10 text-white placeholder-gray-300"
                  placeholder="Add a skill"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSkill(newSkill)
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => handleAddSkill(newSkill)}
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {SKILL_SUGGESTIONS.filter((skill) => !profile.skills.includes(skill)).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-white/20"
                    onClick={() => handleAddSkill(skill)}
                  >
                    + {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-white">
                Experience
              </Label>
              <Textarea
                id="experience"
                value={profile.experience}
                onChange={(e) => setProfile((prev) => ({ ...prev, experience: e.target.value }))}
                className="bg-white/10 text-white placeholder-gray-300"
                placeholder="Share your relevant experience"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability" className="text-white">
                Availability
              </Label>
              <Select value={profile.availability} onValueChange={handleAvailabilityChange}>
                <SelectTrigger className="w-full bg-white/10 text-white">
                  <SelectValue placeholder="Select your availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-white">Social Links</Label>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Github className="w-5 h-5 text-white" />
                  <Input
                    placeholder="GitHub Profile URL"
                    value={profile.socialLinks.github || ""}
                    onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                    className="bg-white/10 text-white placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Linkedin className="w-5 h-5 text-white" />
                  <Input
                    placeholder="LinkedIn Profile URL"
                    value={profile.socialLinks.linkedin || ""}
                    onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                    className="bg-white/10 text-white placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Twitter className="w-5 h-5 text-white" />
                  <Input
                    placeholder="Twitter Profile URL"
                    value={profile.socialLinks.twitter || ""}
                    onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                    className="bg-white/10 text-white placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-white" />
                  <Input
                    placeholder="Portfolio URL"
                    value={profile.socialLinks.portfolio || ""}
                    onChange={(e) => handleSocialLinkChange("portfolio", e.target.value)}
                    className="bg-white/10 text-white placeholder-gray-300"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-white text-purple-600 hover:bg-gray-200 transition-colors"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

