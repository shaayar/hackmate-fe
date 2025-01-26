"use client"

import { useState } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { Bar, Pie } from "react-chartjs-2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import type { Task } from "@/types"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface TaskAnalyticsProps {
  tasks: Task[]
  teamId: string
}

export default function TaskAnalytics({ tasks, teamId }: TaskAnalyticsProps) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar")

  const statusData = {
    labels: ["Not Started", "In Progress", "Completed"],
    datasets: [
      {
        label: "Tasks by Status",
        data: [
          tasks.filter((t) => t.status === "not_started").length,
          tasks.filter((t) => t.status === "in_progress").length,
          tasks.filter((t) => t.status === "completed").length,
        ],
        backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", "rgba(75, 192, 192, 0.5)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const priorityData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Tasks by Priority",
        data: [
          tasks.filter((t) => t.priority === "low").length,
          tasks.filter((t) => t.priority === "medium").length,
          tasks.filter((t) => t.priority === "high").length,
        ],
        backgroundColor: ["rgba(75, 192, 192, 0.5)", "rgba(255, 206, 86, 0.5)", "rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const progressData = {
    labels: tasks.map((t) => t.title.substring(0, 20) + "..."),
    datasets: [
      {
        label: "Task Progress (%)",
        data: tasks.map((t) => t.progress),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  const exportToPDF = async () => {
    const element = document.getElementById("analytics-content")
    if (!element) return

    try {
      const canvas = await html2canvas(element)
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("l", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`team-${teamId}-analytics.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-lg border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-primary-foreground">Task Analytics</CardTitle>
        <div className="flex items-center gap-4">
          <Select value={chartType} onValueChange={(value: "bar" | "pie") => setChartType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportToPDF} variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent id="analytics-content" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card/30 p-4">
            <CardTitle className="text-lg mb-4">Task Status</CardTitle>
            {chartType === "bar" ? (
              <Bar data={statusData} options={options} />
            ) : (
              <Pie data={statusData} options={options} />
            )}
          </Card>
          <Card className="bg-card/30 p-4">
            <CardTitle className="text-lg mb-4">Task Priority</CardTitle>
            {chartType === "bar" ? (
              <Bar data={priorityData} options={options} />
            ) : (
              <Pie data={priorityData} options={options} />
            )}
          </Card>
        </div>
        <Card className="bg-card/30 p-4">
          <CardTitle className="text-lg mb-4">Task Progress</CardTitle>
          <Bar data={progressData} options={options} />
        </Card>
      </CardContent>
    </Card>
  )
}

