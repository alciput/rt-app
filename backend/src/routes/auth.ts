import { Router } from 'express'
import { db, generateId } from '../db.js'

const router = Router()

// Mock login endpoints
router.post('/login/google', (req, res) => {
  const { email, name } = req.body
  
  // Mock Google login - replace with real Google OAuth
  const user = db.users.find(u => u.email === email) || {
    id: generateId(),
    name: name || 'Google User',
    email,
    role: 'Resident' as const
  }

  res.json({
    user,
    token: 'mock-jwt-token-' + user.id
  })
})

router.post('/login/microsoft', (req, res) => {
  const { email, name } = req.body
  
  // Mock Microsoft login - replace with real Microsoft OAuth
  const user = db.users.find(u => u.email === email) || {
    id: generateId(),
    name: name || 'Microsoft User',
    email,
    role: 'Resident' as const
  }

  res.json({
    user,
    token: 'mock-jwt-token-' + user.id
  })
})

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

export { router as authRouter }
