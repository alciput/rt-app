import { Router } from 'express'
import { authenticateToken, requireRole } from '../rbac.js'
import { dbAllWithParams, dbGetWithParams, dbRunWithParams } from '../database/sqlite.js'
import { Resident } from '../types/index.js'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// GET /api/residents - List residents with filters
router.get('/', requireRole(['Owner']), async (req, res) => {
  try {
    const { house, status, role } = req.query
    
    let query = 'SELECT * FROM residents WHERE 1=1'
    const params: any[] = []
    
    if (house) {
      query += ' AND house LIKE ?'
      params.push(`%${house}%`)
    }
    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }
    if (role) {
      query += ' AND role = ?'
      params.push(role)
    }
    
    const residents = await dbAllWithParams(query, params)
    res.json(residents)
  } catch (error) {
    console.error('Error fetching residents:', error)
    res.status(500).json({ error: 'Failed to fetch residents' })
  }
})

// GET /api/residents/:id - Get single resident
router.get('/:id', requireRole(['Owner']), async (req, res) => {
  try {
    const resident = await dbGetWithParams('SELECT * FROM residents WHERE id = ?', [req.params.id])
    if (!resident) {
      return res.status(404).json({ error: 'Resident not found' })
    }
    res.json(resident)
  } catch (error) {
    console.error('Error fetching resident:', error)
    res.status(500).json({ error: 'Failed to fetch resident' })
  }
})

// POST /api/residents - Create resident
router.post('/', requireRole(['Owner']), async (req, res) => {
  try {
    const { id: providedId, name, house, cluster, blok, nikKtp, ktpFile, status = 'active', role = 'Contract', rtId, rwId, familyId, relationship, age } = req.body
    
    if (!name || !house || !cluster) {
      return res.status(400).json({ error: 'Name, house, and cluster are required' })
    }
    
    // Use provided ID if available, otherwise generate new one
    const id = providedId && providedId.trim() !== '' ? providedId : Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const now = new Date().toISOString()
    
    console.log(`Creating resident: ${name}, providedId: ${providedId}, finalId: ${id}`)
    
    // Process ktpFile - if it's base64, store it; if it's a filename, keep as is
    let processedKtpFile = ktpFile
    if (ktpFile && ktpFile.startsWith('data:image/')) {
      // It's a base64 image, store it directly
      processedKtpFile = ktpFile
    } else if (ktpFile && typeof ktpFile === 'string') {
      // It's a filename, keep as is
      processedKtpFile = ktpFile
    }
    
    await dbRunWithParams(
      'INSERT INTO residents (id, name, house, cluster, blok, nikKtp, ktpFile, status, role, rtId, rwId, familyId, relationship, age, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, house, cluster, blok || null, nikKtp || null, processedKtpFile || null, status, role, rtId || 'rt1', rwId || 'rw1', familyId || null, relationship || null, age || null, now, now]
    )
    
    const resident = await dbGetWithParams('SELECT * FROM residents WHERE id = ?', [id])
    res.status(201).json(resident)
  } catch (error) {
    console.error('Error creating resident:', error)
    res.status(500).json({ error: 'Failed to create resident' })
  }
})

// PUT /api/residents/:id - Update resident
router.put('/:id', requireRole(['Owner']), async (req, res) => {
  try {
    const { name, house, cluster, blok, nikKtp, ktpFile, status, role, rtId, rwId, familyId, relationship, age } = req.body
    const now = new Date().toISOString()
    
    console.log('Update resident request body:', req.body)
    
    const updates = []
    const params = []
    
    if (name !== undefined) {
      updates.push('name = ?')
      params.push(name)
    }
    if (house !== undefined) {
      updates.push('house = ?')
      params.push(house)
    }
    if (cluster !== undefined) {
      updates.push('cluster = ?')
      params.push(cluster)
    }
    if (blok !== undefined) {
      updates.push('blok = ?')
      params.push(blok)
    }
    if (nikKtp !== undefined) {
      updates.push('nikKtp = ?')
      params.push(nikKtp)
    }
    if (ktpFile !== undefined) {
      updates.push('ktpFile = ?')
      // Process ktpFile - if it's base64, store it; if it's a filename, keep as is
      let processedKtpFile = ktpFile
      if (ktpFile && ktpFile.startsWith('data:image/')) {
        // It's a base64 image, store it directly
        processedKtpFile = ktpFile
      } else if (ktpFile && typeof ktpFile === 'string') {
        // It's a filename, keep as is
        processedKtpFile = ktpFile
      }
      params.push(processedKtpFile)
    }
    if (status !== undefined) {
      updates.push('status = ?')
      params.push(status)
    }
    if (role !== undefined) {
      updates.push('role = ?')
      params.push(role)
    }
    if (rtId !== undefined) {
      updates.push('rtId = ?')
      params.push(rtId)
    }
    if (rwId !== undefined) {
      updates.push('rwId = ?')
      params.push(rwId)
    }
    if (familyId !== undefined) {
      updates.push('familyId = ?')
      params.push(familyId)
    }
    if (relationship !== undefined) {
      updates.push('relationship = ?')
      params.push(relationship)
    }
    if (age !== undefined) {
      updates.push('age = ?')
      params.push(age)
    }
    
    updates.push('updatedAt = ?')
    params.push(now)
    params.push(req.params.id)
    
    const query = `UPDATE residents SET ${updates.join(', ')} WHERE id = ?`
    console.log('Update query:', query)
    console.log('Update params:', params)
    
    await dbRunWithParams(query, params)
    
    // Check if the resident exists after update
    const resident = await dbGetWithParams('SELECT * FROM residents WHERE id = ?', [req.params.id])
    
    if (!resident) {
      return res.status(404).json({ error: 'Resident not found' })
    }
    
    res.json(resident)
  } catch (error) {
    console.error('Error updating resident:', error)
    res.status(500).json({ error: 'Failed to update resident' })
  }
})

// DELETE /api/residents/:id - Delete resident
router.delete('/:id', requireRole(['Owner']), async (req, res) => {
  try {
    const result = await dbRunWithParams('DELETE FROM residents WHERE id = ?', [req.params.id]) as { changes: number }
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Resident not found' })
    }
    
    res.json({ message: 'Resident deleted successfully' })
  } catch (error) {
    console.error('Error deleting resident:', error)
    res.status(500).json({ error: 'Failed to delete resident' })
  }
})


export { router as residentsRouter }
