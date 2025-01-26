import Peer from "simple-peer"
import { io, type Socket } from "socket.io-client"

class WebRTCService {
  private socket: Socket
  private peers: Map<string, Peer.Instance> = new Map()

  constructor() {
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001")

    this.socket.on("user-connected", (userId) => {
      console.log("New user connected:", userId)
      this.createPeer(userId, this.socket.id, true)
    })

    this.socket.on("offer", ({ sdp, caller }) => {
      this.createPeer(caller, this.socket.id, false, sdp)
    })

    this.socket.on("answer", ({ sdp, caller }) => {
      const peer = this.peers.get(caller)
      if (peer) {
        peer.signal(sdp)
      }
    })

    this.socket.on("ice-candidate", ({ candidate, from }) => {
      const peer = this.peers.get(from)
      if (peer) {
        peer.signal(candidate)
      }
    })
  }

  joinRoom(roomId: string) {
    this.socket.emit("join-room", roomId)
  }

  createPeer(target: string, caller: string, initiator: boolean, offerSdp?: any) {
    const peer = new Peer({
      initiator,
      trickle: false,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:global.stun.twilio.com:3478" }],
      },
    })

    peer.on("signal", (data) => {
      if (initiator) {
        this.socket.emit("offer", { target, caller, sdp: data })
      } else {
        this.socket.emit("answer", { target, caller, sdp: data })
      }
    })

    peer.on("connect", () => {
      console.log("Peer connection established")
    })

    peer.on("error", (err) => {
      console.error("Peer error:", err)
    })

    if (offerSdp) {
      peer.signal(offerSdp)
    }

    this.peers.set(target, peer)
    return peer
  }

  getPeer(peerId: string) {
    return this.peers.get(peerId)
  }

  destroyPeer(peerId: string) {
    const peer = this.peers.get(peerId)
    if (peer) {
      peer.destroy()
      this.peers.delete(peerId)
    }
  }
}

export const webRTCService = new WebRTCService()

