"use client"

import { useState, useEffect, useRef } from "react"
import { useAuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Video, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react"
import { webRTCService } from "@/lib/webrtc"

interface VideoChatProps {
  teamId: string
  targetUserId?: string
  onEndCall: () => void
}

export default function VideoChat({ teamId, targetUserId, onEndCall }: VideoChatProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const { user } = useAuthContext()

  useEffect(() => {
    if (targetUserId) {
      startCall()
    }
    return () => {
      if (targetUserId) {
        webRTCService.destroyPeer(targetUserId)
      }
    }
  }, [targetUserId])

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      setIsCallActive(true)

      webRTCService.joinRoom(teamId)

      if (targetUserId) {
        const peer = webRTCService.createPeer(targetUserId, user!.uid, true)
        peer.addStream(stream)

        peer.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream
          }
        })
      }
    } catch (error) {
      console.error("Error accessing media devices:", error)
    }
  }

  const endCall = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
    setIsCallActive(false)
    if (targetUserId) {
      webRTCService.destroyPeer(targetUserId)
    }
    onEndCall()
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      ;(localVideoRef.current.srcObject as MediaStream).getAudioTracks().forEach((track) => (track.enabled = isMuted))
    }
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      ;(localVideoRef.current.srcObject as MediaStream)
        .getVideoTracks()
        .forEach((track) => (track.enabled = isVideoOff))
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-effect p-2">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-auto" />
          <p className="text-center mt-2 text-primary-foreground">You</p>
        </Card>
        <Card className="glass-effect p-2">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-auto" />
          <p className="text-center mt-2 text-primary-foreground">Team Member</p>
        </Card>
      </div>
      <div className="flex justify-center space-x-4">
        <Button variant={isMuted ? "destructive" : "secondary"} size="icon" onClick={toggleMute}>
          {isMuted ? <MicOff /> : <Mic />}
        </Button>
        <Button variant={isVideoOff ? "destructive" : "secondary"} size="icon" onClick={toggleVideo}>
          {isVideoOff ? <VideoOff /> : <Video />}
        </Button>
        <Button variant="destructive" onClick={endCall}>
          <PhoneOff className="mr-2" />
          End Call
        </Button>
      </div>
    </div>
  )
}

