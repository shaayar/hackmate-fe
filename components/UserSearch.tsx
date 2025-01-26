// ... existing imports
import { UserPlus, UserCheck } from "lucide-react"

// ... existing code

export function UserSearch() {
  // ... existing code

  const handleFriendRequest = async (requestedUser: UserProfile) => {
    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitedUserId: requestedUser.uid, type: "friend" }),
      })

      if (response.ok) {
        toast({
          title: "Friend Request Sent",
          description: `A friend request has been sent to ${requestedUser.displayName}.`,
          variant: "success",
        })
      } else {
        throw new Error("Failed to send friend request")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* ... existing search input */}
      <div className="space-y-2">
        {filteredUsers.map((user) => (
          <div key={user.uid} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
            {/* ... existing user info */}
            <div className="space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleInvite(user)}>
                <UserPlus className="h-4 w-4 mr-1" />
                Invite to Team
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleFriendRequest(user)}>
                <UserCheck className="h-4 w-4 mr-1" />
                Add Friend
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

