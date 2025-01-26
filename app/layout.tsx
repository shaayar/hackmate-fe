import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/AuthContext"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Hackmate - Find Your Perfect Team",
  description: "Connect with developers and join hackathon teams",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-pattern min-h-screen`}>
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-16">
              <Navbar />
              <main className="flex-1 p-6">
                <div className="container mx-auto animate-fade-in">{children}</div>
              </main>
            </div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'