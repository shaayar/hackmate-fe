"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Video, MessageSquare } from "lucide-react"
import type { TeamMember, UserProfile } from "@/types"

interface OnlineTeamMembersProps {
  teamId: string
  onStartVideoCall: (userId: string) => void
  onStartChat: (userId: string) => void
}

export default function OnlineTeamMembers({ teamId, onStartVideoCall, onStartChat }: OnlineTeamMembersProps) {
  const [onlineMembers, setOnlineMembers] = useState<(TeamMember & UserProfile)[]>([])

  useEffect(() => {
    const fetchOnlineMembers = async () => {
      try {
        const response = await fetch(`/api/teams/${teamId}/online-members`)
        const data = await response.json()
        setOnlineMembers(data)
      } catch (error) {
        console.error("Error fetching online members:", error)
      }
    }

    fetchOnlineMembers()
    const interval = setInterval(fetchOnlineMembers, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [teamId])

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-xl text-primary-foreground">Online Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {onlineMembers.map((member) => (
            <div key={member.uid} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={member.photoURL} alt={member.displayName} />
                  <AvatarFallback>{member.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-primary-foreground">{member.displayName}</p>
                  <p className="text-sm text-primary-foreground/60">{member.role}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => onStartVideoCall(member.uid)}>
                  <Video className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline" onClick={() => onStartChat(member.uid)}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
              </div>
            </div>
          ))}
          {onlineMembers.length === 0 && (
            <p className="text-center text-primary-foreground/60">No team members are currently online.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

