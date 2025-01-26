import { initializeApp, getApps, cert } from "firebase-admin/app"

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  })
}

