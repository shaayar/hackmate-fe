import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  console.log("Session check started")
  try {
    const sessionCookie = request.cookies.get("session")?.value

    if (!sessionCookie) {
      console.log("No session cookie found")
      return NextResponse.json({ user: null }, { status: 200 })
    }

    console.log("Verifying session cookie")
    let decodedClaims
    try {
      decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
      console.log("Session cookie verified successfully")
    } catch (error) {
      console.error("Failed to verify session cookie:", error)
      return NextResponse.json({ user: null, error: "Invalid session" }, { status: 200 })
    }

    if (!decodedClaims) {
      console.log("Decoded claims are null or undefined")
      return NextResponse.json({ user: null, error: "Invalid session" }, { status: 200 })
    }

    console.log("Getting user data for UID:", decodedClaims.uid)
    let user
    try {
      user = await adminAuth.getUser(decodedClaims.uid)
      console.log("User data retrieved successfully")
    } catch (error) {
      console.error("Failed to get user data:", error)
      return NextResponse.json({ user: null, error: "User not found" }, { status: 200 })
    }

    if (!user) {
      console.log("User object is null or undefined")
      return NextResponse.json({ user: null, error: "User not found" }, { status: 200 })
    }

    console.log("User found:", user.uid)
    return NextResponse.json(
      {
        user: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Session check failed:", error)
    return NextResponse.json({ user: null, error: "Session check failed" }, { status: 200 })
  } finally {
    console.log("Session check completed")
  }
}

