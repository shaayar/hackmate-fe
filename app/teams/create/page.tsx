"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export default function CreateTeam() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [maxMembers, setMaxMembers] = useState(4)

  const handleAddSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills((prev) => [...prev, skill])
    }
    setNewSkill("")
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          skills,
          maxMembers,
          owner: user?.uid,
        }),
      })

      if (response.ok) {
        router.push("/teams")
      } else {
        throw new Error("Failed to create team")
      }
    } catch (error) {
      console.error("Error creating team:", error)
      // Show error message
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white">Create a New Team</CardTitle>
          <CardDescription className="text-gray-200">
            Start building your dream team for your next project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Team Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/10 text-white placeholder-gray-300"
                placeholder="Enter team name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/10 text-white placeholder-gray-300"
                placeholder="Describe your team's mission and goals"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-white">
                Required Skills
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill) => (
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
                  placeholder="Add required skill"
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMembers" className="text-white">
                Maximum Team Size
              </Label>
              <Input
                id="maxMembers"
                type="number"
                min={2}
                max={10}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number.parseInt(e.target.value))}
                className="bg-white/10 text-white placeholder-gray-300"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-white text-purple-600 hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

