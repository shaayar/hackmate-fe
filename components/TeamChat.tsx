"use client"

import { useState, useEffect, useRef } from "react"
import { useAuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, ImageIcon } from "lucide-react"
import type { Message, UserProfile } from "@/types"

interface TeamChatProps {
  teamId: string
  teamName: string
  targetUserId?: string
}

export default function TeamChat({ teamId, teamName, targetUserId }: TeamChatProps) {
  const { user } = useAuthContext()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([])
  const [activeChat, setActiveChat] = useState<"team" | string>("team")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch initial messages and team members
    const fetchData = async () => {
      try {
        const [messagesResponse, membersResponse] = await Promise.all([
          fetch(`/api/teams/${teamId}/messages`),
          fetch(`/api/teams/${teamId}/members`),
        ])
        const messagesData = await messagesResponse.json()
        const membersData = await membersResponse.json()
        setMessages(messagesData)
        setTeamMembers(membersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time updates
    // TODO: Implement WebSocket or Firebase Real-time Database connection
  }, [teamId])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (targetUserId) {
      setActiveChat(targetUserId)
    }
  }, [targetUserId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const message: Partial<Message> = {
      teamId,
      senderId: user.uid,
      content: newMessage,
      type: "text",
      timestamp: new Date(),
    }

    if (activeChat !== "team") {
      message.recipientId = activeChat
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      })

      if (response.ok) {
        setNewMessage("")
        // Message will be added through real-time updates
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // TODO: Implement file upload logic
    console.log("File upload not implemented yet")
  }

  const filteredMessages = messages.filter((message) => {
    if (activeChat === "team") {
      return !message.recipientId
    }
    return message.senderId === activeChat || message.recipientId === activeChat
  })

  return (
    <Card className="glass-effect h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">
          {activeChat === "team"
            ? `${teamName} Chat`
            : `Chat with ${teamMembers.find((m) => m.uid === activeChat)?.displayName}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Tabs defaultValue="team" className="flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="team">Team Chat</TabsTrigger>
            {teamMembers.map((member) => (
              <TabsTrigger key={member.uid} value={member.uid}>
                {member.displayName}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="team" className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {loading ? (
                <div className="text-center text-gray-300">Loading messages...</div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center text-gray-300">No messages yet</div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.uid ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.senderId === user?.uid ? "bg-purple-600 text-white" : "bg-white/10 text-white"
                      }`}
                    >
                      {message.type === "text" ? (
                        <p>{message.content}</p>
                      ) : message.type === "image" ? (
                        <img
                          src={message.fileUrl || "/placeholder.svg"}
                          alt="Shared image"
                          className="max-w-full rounded"
                        />
                      ) : (
                        <a
                          href={message.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          View attached file
                        </a>
                      )}
                      <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </TabsContent>
          {teamMembers.map((member) => (
            <TabsContent key={member.uid} value={member.uid} className="flex-1 flex flex-col">
              {/* Direct messages content */}
            </TabsContent>
          ))}
        </Tabs>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="bg-white/10 text-white placeholder-gray-300"
          />
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx"
          />
          <Button
            type="button"
            variant="outline"
            className="bg-white/10 text-white hover:bg-white/20"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button type="submit" className="bg-white text-purple-600 hover:bg-gray-200">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

