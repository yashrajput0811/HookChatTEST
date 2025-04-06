import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { v4 as uuidv4 } from 'uuid'
import dotenv from "dotenv"
import { translate } from '@vitalets/google-translate-api'

dotenv.config()

const app = express()
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}))
app.use(express.json())

// Translation endpoint
app.post('/translate', async (req, res) => {
  try {
    const { text, targetLang } = req.body
    const result = await translate(text, { to: targetLang })
    res.json({ translatedText: result.text })
  } catch (error) {
    console.error('Translation error:', error)
    res.status(500).json({ error: 'Translation failed' })
  }
})

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
})

// Store active users and their rooms
const users = new Map()
const rooms = new Map()

// Function to find a matching partner
function findMatch(socket, userData) {
  for (const [userId, user] of users) {
    // Don't match with self or already matched users
    if (userId !== socket.id && !user.matched) {
      // Check if they have at least one common interest
      const hasCommonInterests = userData.interests.some(interest => 
        user.interests.includes(interest)
      )
      
      if (hasCommonInterests) {
        return userId
      }
    }
  }
  return null
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("user_info", (userData) => {
    console.log("Received user info:", userData)
    users.set(socket.id, { ...userData, matched: false })
    
    // Try to find a match
    const matchId = findMatch(socket, userData)
    if (matchId) {
      const roomId = uuidv4()
      const matchedUser = users.get(matchId)
      
      // Update matched status
      users.set(socket.id, { ...userData, matched: true })
      users.set(matchId, { ...matchedUser, matched: true })
      
      // Create and store room info
      rooms.set(roomId, [socket.id, matchId])
      
      // Join both users to the room
      socket.join(roomId)
      io.sockets.sockets.get(matchId)?.join(roomId)
      
      // Notify both users
      io.to(roomId).emit("chat_started", { 
        roomId,
        interests: [...new Set([...userData.interests, ...matchedUser.interests])]
      })
      console.log("Match found! Room created:", roomId)
    } else {
      console.log("No match found for user:", socket.id)
    }
  })

  socket.on("send_message", ({ roomId, message, type = 'text', imageUrl }) => {
    console.log("Message received:", { roomId, message, type })
    io.to(roomId).emit("receive_message", {
      sender: socket.id,
      message,
      type,
      imageUrl,
      timestamp: new Date().toISOString()
    })
  })

  socket.on("typing", ({ roomId, isTyping }) => {
    socket.to(roomId).emit("partner_typing", { isTyping })
  })

  socket.on("disconnect", () => {
    // Find and clean up user's room
    for (const [roomId, participants] of rooms) {
      if (participants.includes(socket.id)) {
        // Notify other participant
        const otherUser = participants.find(id => id !== socket.id)
        if (otherUser) {
          io.to(otherUser).emit("partner_disconnected")
          users.set(otherUser, { ...users.get(otherUser), matched: false })
        }
        rooms.delete(roomId)
        break
      }
    }
    users.delete(socket.id)
    console.log("User disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
