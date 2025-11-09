import { Router } from 'express'
import { authenticateToken, requireRole } from '../rbac.js'
import { dbAll, dbGet, dbRun, dbAllWithParams, dbGetWithParams, dbRunWithParams } from '../database/sqlite.js'
import { Announcement } from '../types/index.js'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// GET /api/announcements - List announcements
router.get('/', async (req, res) => {
  try {
    const { rtId, rwId } = req.query
    
    let query = 'SELECT * FROM announcements WHERE 1=1'
    const params: any[] = []
    
    // Filter by RT/RW based on user role
    if (req.user?.role === 'Contract') {
      query += ' AND (rtId = ? OR rwId = ?)'
      params.push(req.user.rtId, req.user.rwId)
    }
    
    if (rtId) {
      query += ' AND rtId = ?'
      params.push(rtId)
    }
    if (rwId) {
      query += ' AND rwId = ?'
      params.push(rwId)
    }
    
    query += ' ORDER BY createdAt DESC'
    
    const announcements = await dbAllWithParams(query, params)
    
    // Fetch attachments for each announcement
    const announcementsWithAttachments = await Promise.all(
      announcements.map(async (announcement) => {
        try {
          const attachments = await dbAllWithParams(
            'SELECT * FROM announcement_attachments WHERE announcementId = ?',
            [announcement.id]
          )
          return { ...announcement, attachments }
        } catch (error) {
          console.error(`Error fetching attachments for announcement ${announcement.id}:`, error)
          return { ...announcement, attachments: [] }
        }
      })
    )
    
    res.json(announcementsWithAttachments)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    res.status(500).json({ error: 'Failed to fetch announcements' })
  }
})

// POST /api/announcements - Create announcement
router.post('/', requireRole(['Contract', 'Owner']), async (req, res) => {
  try {
    const { 
      title, 
      body, 
      content, 
      category = 'general', 
      visibility = 'rt', 
      status = 'draft',
      publishDate,
      expiryDate 
    } = req.body
    
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' })
    }
    
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const now = new Date().toISOString()
    
    await dbRunWithParams(
      `INSERT INTO announcements (
        id, title, body, content, authorId, rtId, rwId, 
        visibility, category, status, publishDate, expiryDate, 
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, 
        title, 
        body, 
        content || null,
        req.user!.id,
        req.user?.rtId || null,
        req.user?.rwId || null,
        visibility,
        category,
        status,
        publishDate || null,
        expiryDate || null,
        now, 
        now
      ]
    )
    
    const announcement = await dbGetWithParams('SELECT * FROM announcements WHERE id = ?', [id])
    res.status(201).json(announcement)
  } catch (error) {
    console.error('Error creating announcement:', error)
    res.status(500).json({ error: 'Failed to create announcement' })
  }
})

// PUT /api/announcements/:id - Update announcement
router.put('/:id', requireRole(['Contract', 'Owner']), async (req, res) => {
  try {
    const { 
      title, 
      body, 
      content, 
      category, 
      visibility, 
      status,
      publishDate,
      expiryDate,
      archivedAt
    } = req.body
    
    if (!title && !body && !content && !category && !visibility && !status) {
      return res.status(400).json({ error: 'At least one field is required' })
    }
    
    // Check if announcement exists
    const existingAnnouncement = await dbGetWithParams('SELECT * FROM announcements WHERE id = ?', [req.params.id])
    if (!existingAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found' })
    }
    
    // Check if user can edit this announcement
    if (req.user?.role !== 'Owner' && existingAnnouncement.authorId !== req.user?.id) {
      return res.status(403).json({ error: 'Can only edit your own announcements' })
    }
    
    const now = new Date().toISOString()
    
    // Build update query dynamically
    const updates = []
    const params = []
    
    if (title !== undefined) {
      updates.push('title = ?')
      params.push(title)
    }
    if (body !== undefined) {
      updates.push('body = ?')
      params.push(body)
    }
    if (content !== undefined) {
      updates.push('content = ?')
      params.push(content)
    }
    if (category !== undefined) {
      updates.push('category = ?')
      params.push(category)
    }
    if (visibility !== undefined) {
      updates.push('visibility = ?')
      params.push(visibility)
    }
    if (status !== undefined) {
      updates.push('status = ?')
      params.push(status)
    }
    if (publishDate !== undefined) {
      updates.push('publishDate = ?')
      params.push(publishDate)
    }
    if (expiryDate !== undefined) {
      updates.push('expiryDate = ?')
      params.push(expiryDate)
    }
    if (archivedAt !== undefined) {
      updates.push('archivedAt = ?')
      params.push(archivedAt)
    }
    
    updates.push('updatedAt = ?')
    params.push(now)
    params.push(req.params.id)
    
    await dbRunWithParams(
      `UPDATE announcements SET ${updates.join(', ')} WHERE id = ?`,
      params
    )
    
    const updatedAnnouncement = await dbGetWithParams('SELECT * FROM announcements WHERE id = ?', [req.params.id])
    res.json(updatedAnnouncement)
  } catch (error) {
    console.error('Error updating announcement:', error)
    res.status(500).json({ error: 'Failed to update announcement' })
  }
})

// DELETE /api/announcements/:id - Delete announcement
router.delete('/:id', requireRole(['Contract', 'Owner']), async (req, res) => {
  try {
    // Check if announcement exists
    const existingAnnouncement = await dbGetWithParams('SELECT * FROM announcements WHERE id = ?', [req.params.id])
    if (!existingAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found' })
    }
    
    // Check if user can delete this announcement
    if (req.user?.role !== 'Owner' && existingAnnouncement.authorId !== req.user?.id) {
      return res.status(403).json({ error: 'Can only delete your own announcements' })
    }
    
    await dbRunWithParams('DELETE FROM announcements WHERE id = ?', [req.params.id])
    res.json({ message: 'Announcement deleted successfully' })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    res.status(500).json({ error: 'Failed to delete announcement' })
  }
})

// POST /api/announcements/:id/attachments - Add attachment to announcement
router.post('/:id/attachments', requireRole(['Contract', 'Owner']), async (req, res) => {
  try {
    const { fileName, fileType, fileSize, fileData } = req.body
    
    if (!fileName || !fileType || !fileSize || !fileData) {
      return res.status(400).json({ error: 'All attachment fields are required' })
    }
    
    const attachmentId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const now = new Date().toISOString()
    
    await dbRunWithParams(
      'INSERT INTO announcement_attachments (id, announcementId, fileName, fileType, fileSize, fileData, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [attachmentId, req.params.id, fileName, fileType, fileSize, fileData, now]
    )
    
    const attachment = await dbGetWithParams('SELECT * FROM announcement_attachments WHERE id = ?', [attachmentId])
    res.status(201).json(attachment)
  } catch (error) {
    console.error('Error adding attachment:', error)
    res.status(500).json({ error: 'Failed to add attachment' })
  }
})

// Note: Reactions and comments endpoints removed as the tables were deleted
// These features can be re-implemented in the future if needed

export { router as announcementsRouter }
