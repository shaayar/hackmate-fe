export type UserProfile = {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  bio?: string
  skills: string[]
  experience: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
    facebook?: string
    portfolio?: string
  }
  availability: "available" | "busy" | "offline"
  isOnline: boolean
  lastActive: Date
}

export type Team = {
  id: string
  name: string
  description: string
  skills: string[]
  members: TeamMember[]
  owner: string
  maxMembers: number
  status: "recruiting" | "full" | "completed"
  project?: Project
  createdAt: Date
}

export type TeamMember = {
  uid: string
  role: string
  joinedAt: Date
  isOnline: boolean
  lastActive: Date
}

export type Project = {
  id: string
  name: string
  description: string
  technologies: string[]
  githubUrl?: string
  demoUrl?: string
  thumbnailUrl?: string
  status: "planning" | "in-progress" | "completed"
}

export type Message = {
  id: string
  teamId: string
  senderId: string
  content: string
  timestamp: Date
  type: "text" | "image" | "file"
  fileUrl?: string
}

export type Notification = {
  id: string
  userId: string
  type: "team_invite" | "message" | "project_update"
  title: string
  content: string
  read: boolean
  timestamp: Date
  actionUrl?: string
}

export type Task = {
  id: string
  title: string
  description: string
  assignedTo: string
  createdBy: string
  teamId: string
  status: "not_started" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  progress: number
  dueDate: Date
  createdAt: Date
  updatedAt: Date
  comments: TaskComment[]
}

export type TaskComment = {
  id: string
  taskId: string
  userId: string
  content: string
  createdAt: Date
}

