"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto bg-card/50 backdrop-blur-md border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary-foreground">Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
        </CardContent>
      </Card>
    </div>
  )
}

