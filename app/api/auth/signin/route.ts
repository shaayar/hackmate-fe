import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"
import { auth } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    const { email, password, idToken } = await request.json()

    let userRecord

    if (idToken) {
      // Handle social sign-in
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      userRecord = await adminAuth.getUser(decodedToken.uid)
    } else if (email && password) {
      // Handle email/password sign-in
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        userRecord = await adminAuth.getUser(userCredential.user.uid)
      } catch (error: any) {
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
          return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }
        throw error
      }
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
      { status: 200 },
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
    console.error("Sign in error:", error)

    // Handle specific Firebase Auth errors
    if (error.code === "auth/user-disabled") {
      return NextResponse.json({ error: "Account has been disabled" }, { status: 403 })
    }

    if (error.code === "auth/invalid-email") {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    if (error.code === "auth/operation-not-allowed") {
      return NextResponse.json({ error: "Operation not allowed" }, { status: 403 })
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

