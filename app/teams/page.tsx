"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Users } from "lucide-react"
import type { Team } from "@/types"

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const { user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Fetch teams
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams")
        const data = await response.json()
        setTeams(data)
      } catch (error) {
        console.error("Error fetching teams:", error)
      }
    }

    fetchTeams()
  }, [user, router])

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSkills = selectedSkills.length === 0 || selectedSkills.some((skill) => team.skills.includes(skill))

    return matchesSearch && matchesSkills
  })

  const allSkills = Array.from(new Set(teams.flatMap((team) => team.skills)))

  const handleJoinTeam = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.uid }),
      })

      if (response.ok) {
        // Update teams list
        setTeams(
          teams.map((team) =>
            team.id === teamId
              ? { ...team, members: [...team.members, { uid: user!.uid, role: "member", joinedAt: new Date() }] }
              : team,
          ),
        )
      }
    } catch (error) {
      console.error("Error joining team:", error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Available Teams</h1>
        <Link href="/teams/create">
          <Button className="bg-white text-purple-600 hover:bg-gray-200">
            <Plus className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </Link>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 text-white placeholder-gray-300"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {allSkills.map((skill) => (
            <Badge
              key={skill}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedSkills.includes(skill) ? "bg-white text-purple-600" : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => {
                setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="glass-effect">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex justify-between items-center">
                {team.name}
                <Badge variant="outline" className="bg-white/10 text-white">
                  <Users className="mr-1 h-3 w-3" />
                  {team.members.length}/{team.maxMembers}
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-200">{team.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-300 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {team.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-white/10 text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Badge
                    variant={team.status === "recruiting" ? "default" : "secondary"}
                    className={team.status === "recruiting" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}
                  >
                    {team.status}
                  </Badge>
                  {team.status === "recruiting" && !team.members.some((member) => member.uid === user?.uid) && (
                    <Button
                      onClick={() => handleJoinTeam(team.id)}
                      className="bg-white text-purple-600 hover:bg-gray-200"
                    >
                      Join Team
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center text-gray-300 mt-8">No teams found matching your criteria</div>
      )}
    </div>
  )
}

