import express from 'express'
import cors from 'cors'
import { residentsRouter } from './routes/residents.js'
import { announcementsRouter } from './routes/announcements.js'
import { iuranRouter } from './routes/iuran.js'
import { suratRouter } from './routes/surat.js'
import { authRouter } from './routes/auth.js'
import { initDatabase, seedDatabase } from './database/sqlite.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: '50mb' })) // Increase payload limit for large base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Initialize SQLite database
async function startServer() {
  try {
    await initDatabase()
    await seedDatabase()
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📊 SQLite database: database.sqlite`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

// Routes
app.use('/api/auth', authRouter)
app.use('/api/residents', residentsRouter)
app.use('/api/announcements', announcementsRouter)
app.use('/api/iuran', iuranRouter)
app.use('/api/surat', suratRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Server startup moved to startServer() function above
