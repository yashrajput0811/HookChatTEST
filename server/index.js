import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// Store active users and their preferences
const activeUsers = new Map()
const waitingQueue = []
let reportLog = []
let bannedUsers = []

io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id)

  // Handle user joining
  socket.on("join", async (userData) => {
    const { gender, country, interests, avatar } = userData
    
    // Store user data
    activeUsers.set(socket.id, {
      socket,
      gender,
      country,
      interests,
      avatar,
      isGhost: false,
    })

    // Try to find a match
    findMatch(socket.id)
  })

  socket.on("send_message", ({ to, text, avatar }) => {
    io.to(to).emit("receive_message", { from: socket.id, text, avatar })
  })

  socket.on("typing", ({ to }) => {
    io.to(to).emit("stranger_typing")
  })

  socket.on("stop_typing", ({ to }) => {
    io.to(to).emit("stranger_stop_typing")
  })

  socket.on("report_user", ({ reportedId }) => {
    reportLog.push({ from: socket.id, reportedId, time: new Date() })
    console.log(`🚩 User ${socket.id} reported ${reportedId}`)
    // bannedUsers.push(reportedId) // optional
  })

  // Handle user leaving
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id)
    activeUsers.delete(socket.id)
    // Remove from waiting queue if present
    const queueIndex = waitingQueue.indexOf(socket.id)
    if (queueIndex !== -1) {
      waitingQueue.splice(queueIndex, 1)
    }
  })

  // Handle messages
  socket.on("message", (data) => {
    const { to, message } = data
    const recipientSocket = activeUsers.get(to)?.socket
    if (recipientSocket) {
      recipientSocket.emit("message", {
        from: socket.id,
        message,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // Handle typing indicator
  socket.on("typing", (data) => {
    const { to, isTyping } = data
    const recipientSocket = activeUsers.get(to)?.socket
    if (recipientSocket) {
      recipientSocket.emit("typing", {
        from: socket.id,
        isTyping,
      })
    }
  })

  // Handle next chat request
  socket.on("next", () => {
    findMatch(socket.id)
  })

  // Handle ghost mode toggle
  socket.on("toggleGhost", (isGhost) => {
    const user = activeUsers.get(socket.id)
    if (user) {
      user.isGhost = isGhost
    }
  })
})

// Match finding logic
function findMatch(userId) {
  const user = activeUsers.get(userId)
  if (!user) return

  // Remove from waiting queue if already there
  const queueIndex = waitingQueue.indexOf(userId)
  if (queueIndex !== -1) {
    waitingQueue.splice(queueIndex, 1)
  }

  // Find a compatible match
  for (const [id, potentialMatch] of activeUsers.entries()) {
    if (
      id !== userId &&
      !potentialMatch.isGhost &&
      !user.isGhost &&
      (user.gender === "any" || potentialMatch.gender === user.gender) &&
      (user.country === "any" || potentialMatch.country === user.country) &&
      hasCommonInterests(user.interests, potentialMatch.interests)
    ) {
      // Create chat room
      const roomId = `${userId}-${id}`
      user.socket.join(roomId)
      potentialMatch.socket.join(roomId)

      // Notify both users
      user.socket.emit("matchFound", {
        roomId,
        partner: {
          id,
          avatar: potentialMatch.avatar,
        },
      })

      potentialMatch.socket.emit("matchFound", {
        roomId,
        partner: {
          id: userId,
          avatar: user.avatar,
        },
      })

      return
    }
  }

  // If no match found, add to waiting queue
  waitingQueue.push(userId)
}

// Helper function to check for common interests
function hasCommonInterests(interests1, interests2) {
  if (!interests1.length || !interests2.length) return true
  return interests1.some((interest) => interests2.includes(interest))
}

httpServer.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001")
})
