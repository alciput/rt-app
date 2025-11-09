import { Router } from 'express'
import { authenticateToken, requireRole } from '../rbac.js'
import { dbAll, dbGet, dbRun } from '../database/sqlite.js'
import { SuratRequest, SuratStatus } from '../types/index.js'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// GET /api/surat - List surat requests
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM surat_requests WHERE 1=1'
    const params: any[] = []
    
    // Filter based on user role
    if (req.user?.role === 'Resident') {
      query += ' AND residentId = ?'
      params.push(req.user.id)
    } else if (req.user?.role === 'Ketua RT') {
      query += ' AND residentId IN (SELECT id FROM residents WHERE rtId = ?)'
      params.push(req.user.rtId)
    } else if (req.user?.role === 'Ketua RW') {
      query += ' AND residentId IN (SELECT id FROM residents WHERE rwId = ?)'
      params.push(req.user.rwId)
    }
    
    query += ' ORDER BY createdAt DESC'
    
    const requests = await dbAll(query, params)
    res.json(requests)
  } catch (error) {
    console.error('Error fetching surat requests:', error)
    res.status(500).json({ error: 'Failed to fetch surat requests' })
  }
})

// POST /api/surat - Create surat request
router.post('/', async (req, res) => {
  try {
    const { type, description } = req.body
    
    if (!type) {
      return res.status(400).json({ error: 'Type is required' })
    }
    
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const now = new Date().toISOString()
    
    await dbRun(
      'INSERT INTO surat_requests (id, residentId, type, status, description, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [id, req.user!.id, type, 'pending', description || null, now]
    )
    
    const suratRequest = await dbGet('SELECT * FROM surat_requests WHERE id = ?', [id])
    res.status(201).json(suratRequest)
  } catch (error) {
    console.error('Error creating surat request:', error)
    res.status(500).json({ error: 'Failed to create surat request' })
  }
})

// PUT /api/surat/:id/approve-rt - RT approval
router.put('/:id/approve-rt', requireRole(['Ketua RT', 'Admin', 'Owner']), async (req, res) => {
  try {
    const now = new Date().toISOString()
    
    await dbRun(
      'UPDATE surat_requests SET status = ?, rtApprovedAt = ? WHERE id = ? AND status = ?',
      ['rt-approved', now, req.params.id, 'pending']
    )
    
    const surat = await dbGet('SELECT * FROM surat_requests WHERE id = ?', [req.params.id])
    
    if (!surat) {
      return res.status(404).json({ error: 'Surat request not found or not pending' })
    }
    
    res.json(surat)
  } catch (error) {
    console.error('Error approving RT request:', error)
    res.status(500).json({ error: 'Failed to approve RT request' })
  }
})

// PUT /api/surat/:id/approve-rw - RW approval
router.put('/:id/approve-rw', requireRole(['Ketua RW', 'Admin', 'Owner']), async (req, res) => {
  try {
    const now = new Date().toISOString()
    
    await dbRun(
      'UPDATE surat_requests SET status = ?, rwApprovedAt = ? WHERE id = ? AND status = ?',
      ['rw-approved', now, req.params.id, 'rt-approved']
    )
    
    const surat = await dbGet('SELECT * FROM surat_requests WHERE id = ?', [req.params.id])
    
    if (!surat) {
      return res.status(404).json({ error: 'Surat request not found or not RT-approved' })
    }
    
    res.json(surat)
  } catch (error) {
    console.error('Error approving RW request:', error)
    res.status(500).json({ error: 'Failed to approve RW request' })
  }
})

// PUT /api/surat/:id/approve-admin - Admin approval
router.put('/:id/approve-admin', requireRole(['Admin', 'Owner']), async (req, res) => {
  try {
    const now = new Date().toISOString()
    
    await dbRun(
      'UPDATE surat_requests SET status = ?, adminApprovedAt = ? WHERE id = ? AND status = ?',
      ['admin-approved', now, req.params.id, 'rw-approved']
    )
    
    const surat = await dbGet('SELECT * FROM surat_requests WHERE id = ?', [req.params.id])
    
    if (!surat) {
      return res.status(404).json({ error: 'Surat request not found or not RW-approved' })
    }
    
    res.json(surat)
  } catch (error) {
    console.error('Error approving admin request:', error)
    res.status(500).json({ error: 'Failed to approve admin request' })
  }
})

// PUT /api/surat/:id/reject - Reject request
router.put('/:id/reject', requireRole(['Ketua RT', 'Ketua RW', 'Admin', 'Owner']), async (req, res) => {
  try {
    const now = new Date().toISOString()
    
    await dbRun(
      'UPDATE surat_requests SET status = ?, rejectedAt = ? WHERE id = ? AND status != ?',
      ['rejected', now, req.params.id, 'rejected']
    )
    
    const surat = await dbGet('SELECT * FROM surat_requests WHERE id = ?', [req.params.id])
    
    if (!surat) {
      return res.status(404).json({ error: 'Surat request not found or already rejected' })
    }
    
    res.json(surat)
  } catch (error) {
    console.error('Error rejecting request:', error)
    res.status(500).json({ error: 'Failed to reject request' })
  }
})

export { router as suratRouter }
