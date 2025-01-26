import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { email, password, idToken } = await request.json()

    let userRecord

    if (idToken) {
      // Handle social sign-up
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      userRecord = await adminAuth.getUser(decodedToken.uid)
    } else if (email && password) {
      // Handle email/password sign-up
      userRecord = await adminAuth.createUser({
        email,
        password,
        emailVerified: false,
      })
    } else {
      return NextResponse.json({ error: "Invalid credentials provided" }, { status: 400 })
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(userRecord.uid, { expiresIn })

    // Create the response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          emailVerified: userRecord.emailVerified,
        },
      },
      { status: 201 },
    )

    // Set the session cookie
    response.cookies.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Sign up error:", error)

    // Ensure we always return a JSON response, even for unexpected errors
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}

