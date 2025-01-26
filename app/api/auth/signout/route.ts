import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 })

    // Clear the session cookie
    response.cookies.set("session", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Sign out failed:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

