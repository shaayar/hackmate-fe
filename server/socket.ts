import type { Server as HttpServer } from "http"
import { Server } from "socket.io"

export function initializeSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id)

    socket.on("join-room", (roomId) => {
      socket.join(roomId)
      socket.to(roomId).emit("user-connected", socket.id)
    })

    socket.on("offer", ({ target, caller, sdp }) => {
      io.to(target).emit("offer", { sdp, caller })
    })

    socket.on("answer", ({ target, caller, sdp }) => {
      io.to(target).emit("answer", { sdp, caller })
    })

    socket.on("ice-candidate", ({ target, candidate }) => {
      io.to(target).emit("ice-candidate", { candidate, from: socket.id })
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })
  })

  return io
}

