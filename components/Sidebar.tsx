"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Home, Users, Calendar, CheckSquare, MessageSquare, Video, Settings, Menu, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()
  const { user } = useAuthContext()

  const links = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/teams", icon: Users, label: "Teams" },
    { href: "/calendar", icon: Calendar, label: "Calendar" },
    { href: "/tasks", icon: CheckSquare, label: "Tasks" },
    { href: "/chat", icon: MessageSquare, label: "Chat" },
    { href: "/video-chat", icon: Video, label: "Video Chat" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  if (!user) return null

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "flex flex-col transition-all duration-300 ease-in-out",
          "border-r border-border/40 shadow-lg",
          isExpanded ? "w-64" : "w-16",
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex items-center h-16 px-4">
          {isExpanded ? (
            <span className="text-2xl font-bold text-primary transition-opacity duration-200 ease-in">Hackmate</span>
          ) : (
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        <nav className="flex-1 overflow-hidden">
          <ul className="px-2 py-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.href}>
                  <Link href={link.href} passHref>
                    <Button
                      variant={pathname === link.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-4 transition-all duration-200 ease-in-out",
                        !isExpanded && "px-2",
                        pathname === link.href && "bg-primary text-primary-foreground",
                      )}
                    >
                      <Icon className={cn("h-5 w-5 transition-all duration-200", isExpanded ? "mr-2" : "mr-0")} />
                      <span className={cn("transition-all duration-200", isExpanded ? "opacity-100" : "opacity-0 w-0")}>
                        {link.label}
                      </span>
                    </Button>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div
          className={cn(
            "absolute top-1/2 -right-3 transform -translate-y-1/2",
            "transition-opacity duration-200",
            isExpanded ? "opacity-0" : "opacity-100",
          )}
        >
          <div className="bg-primary/10 rounded-full p-1">
            <ChevronRight className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
      <div className={cn("transition-all duration-300 ease-in-out shrink-0", isExpanded ? "w-64" : "w-16")} />
    </>
  )
}

