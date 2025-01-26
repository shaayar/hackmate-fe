import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/contexts/AuthContext"
import type { UserProfile } from "@/types"

export function FriendList() {
  const [friends, setFriends] = useState<UserProfile[]>([])
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`/api/users/${user?.uid}/friends`)
        const data = await response.json()
        setFriends(data)
      } catch (error) {
        console.error("Error fetching friends:", error)
      }
    }

    if (user) {
      fetchFriends()
    }
  }, [user])

  const getStatusColor = (availability: UserProfile["availability"]) => {
    switch (availability) {
      case "available":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-2">
      {friends.map((friend) => (
        <div key={friend.uid} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={friend.photoURL} alt={friend.displayName} />
              <AvatarFallback>{friend.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-white">{friend.displayName}</p>
              <Badge variant="outline" className={`text-xs ${getStatusColor(friend.availability)}`}>
                {friend.availability}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

