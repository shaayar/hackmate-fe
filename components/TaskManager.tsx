"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Plus, CalendarIcon } from "lucide-react"
import type { Task } from "@/types"

interface TaskManagerProps {
  initialTasks: Task[]
  teamId: string
  userId: string
}

export default function TaskManager({ initialTasks, teamId, userId }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "not_started",
    priority: "medium",
    progress: 0,
    dueDate: new Date(),
  })

  const handleCreateTask = async () => {
    if (!newTask.title) return

    const task: Task = {
      id: Date.now().toString(),
      ...(newTask as Omit<Task, "id">),
      assignedTo: userId,
      createdBy: userId,
      teamId,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    } as Task

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })

      if (response.ok) {
        setTasks([...tasks, task])
        setNewTask({
          title: "",
          description: "",
          status: "not_started",
          priority: "medium",
          progress: 0,
          dueDate: new Date(),
        })
      }
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  const updateTaskProgress = async (taskId: string, progress: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
      })

      if (response.ok) {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, progress } : task)))
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to track progress</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task["priority"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value as Task["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Due Date</label>
              <Calendar
                mode="single"
                selected={newTask.dueDate}
                onSelect={(date) => date && setNewTask({ ...newTask, dueDate: date })}
                className="rounded-md border"
              />
            </div>
            <Button onClick={handleCreateTask} className="w-full">
              Create Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 rounded-lg bg-card/30 border border-primary/20 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-primary-foreground">{task.title}</h3>
                <p className="text-sm text-primary-foreground/60">{task.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === "high"
                      ? "bg-red-500/20 text-red-500"
                      : task.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-green-500/20 text-green-500"
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    task.status === "completed"
                      ? "bg-green-500/20 text-green-500"
                      : task.status === "in_progress"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-gray-500/20 text-gray-500"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-primary-foreground/60">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <Slider
                value={[task.progress]}
                min={0}
                max={100}
                step={5}
                onValueChange={([value]) => updateTaskProgress(task.id, value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-between items-center text-sm text-primary-foreground/60">
              <span>Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
              <span>Created: {format(new Date(task.createdAt), "MMM dd, yyyy")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

