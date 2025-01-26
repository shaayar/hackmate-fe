import express from "express"
import http from "http"
import next from "next"
import { initializeSocketServer } from "./socket"

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  const httpServer = http.createServer(server)

  initializeSocketServer(httpServer)

  server.all("*", (req, res) => {
    return handle(req, res)
  })

  const port = process.env.PORT || 3000
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})

