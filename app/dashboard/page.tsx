"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskManager from "@/components/TaskManager"
import TeamChat from "@/components/TeamChat"
import VideoChat from "@/components/VideoChat"
import OnlineTeamMembers from "@/components/OnlineTeamMembers"
import { Calendar } from "@/components/ui/calendar"
import { Plus } from "lucide-react"
import type { Team, Task } from "@/types"

export default function Dashboard() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("tasks")
  const [activeVideoCall, setActiveVideoCall] = useState<string | null>(null)
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Fetch user's teams and tasks
    const fetchData = async () => {
      try {
        const teamsResponse = await fetch(`/api/users/${user.uid}/teams`)
        const teamsData = await teamsResponse.json()
        setTeams(teamsData)

        const tasksResponse = await fetch(`/api/users/${user.uid}/tasks`)
        const tasksData = await tasksResponse.json()
        setTasks(tasksData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [user, router])

  const handleStartVideoCall = (userId: string) => {
    setActiveVideoCall(userId)
    setActiveTab("video")
  }

  const handleStartChat = (userId: string) => {
    setActiveChatUser(userId)
    setActiveTab("chat")
  }

  const handleEndCall = () => {
    setActiveVideoCall(null)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome, {user?.displayName || "there"}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-effect">
          <CardHeader>
            <CardTitle className="text-xl text-primary-foreground">Your Teams</CardTitle>
          </CardHeader>
          <CardContent>
            {teams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-primary-foreground/60 mb-4">No teams yet.</p>
                <Button
                  onClick={() => router.push("/teams/create")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => (
                  <Card
                    key={team.id}
                    className="bg-card/30 hover:bg-card/40 transition-colors cursor-pointer"
                    onClick={() => router.push(`/teams/${team.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-primary-foreground">{team.name}</h3>
                          <p className="text-sm text-primary-foreground/60">{team.members.length} members</p>
                        </div>
                        <Button
                          variant="ghost"
                          className="text-primary-foreground hover:text-primary hover:bg-primary/10"
                        >
                          View Team
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-xl text-primary-foreground">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-primary/20"
            />
          </CardContent>
        </Card>
      </div>

      <OnlineTeamMembers
        teamId={teams[0]?.id || ""}
        onStartVideoCall={handleStartVideoCall}
        onStartChat={handleStartChat}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card/50 border-primary/20">
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Tasks
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Team Chat
          </TabsTrigger>
          <TabsTrigger
            value="video"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Video Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-xl text-primary-foreground">Task Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskManager initialTasks={tasks} teamId={teams[0]?.id || ""} userId={user.uid} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-xl text-primary-foreground">Team Chat</CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length > 0 ? (
                <TeamChat teamId={teams[0].id} teamName={teams[0].name} targetUserId={activeChatUser || undefined} />
              ) : (
                <div className="text-center py-8 text-primary-foreground/60">Join a team to start chatting</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-xl text-primary-foreground">Video Chat</CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length > 0 ? (
                <VideoChat teamId={teams[0].id} targetUserId={activeVideoCall || undefined} onEndCall={handleEndCall} />
              ) : (
                <div className="text-center py-8 text-primary-foreground/60">Join a team to start video chatting</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

