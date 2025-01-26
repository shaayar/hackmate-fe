import type { NextApiRequest, NextApiResponse } from "next"
import { getAuth } from "firebase-admin/auth"
import "../lib/firebase-admin"

export async function authenticateRequest(req: NextApiRequest, res: NextApiResponse): Promise<string | null> {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid authorization header" })
    return null
  }

  try {
    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await getAuth().verifyIdToken(token)
    return decodedToken.uid
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(401).json({ message: "Invalid authentication token" })
    return null
  }
}

