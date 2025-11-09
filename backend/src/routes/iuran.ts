import { Router } from 'express'
import { authenticateToken, requireRole } from '../rbac.js'
import { dbAllWithParams, dbGetWithParams, dbRunWithParams } from '../database/sqlite.js'
import { IuranPayment } from '../types/index.js'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// GET /api/iuran - List payments with filters
router.get('/', async (req, res) => {
  try {
    const { month, year, paid, residentId } = req.query
    
    let query = 'SELECT * FROM iuran_payments WHERE 1=1'
    const params: any[] = []
    
    // Filter by resident's RT/RW based on user role
    if (req.user?.role === 'Contract') {
      query += ' AND residentId IN (SELECT id FROM residents WHERE rtId = ?)'
      params.push(req.user.rtId)
    } else if (req.user?.role === 'Owner') {
      query += ' AND residentId IN (SELECT id FROM residents WHERE rwId = ?)'
      params.push(req.user.rwId)
    } else if (req.user?.role === 'Resident') {
      query += ' AND residentId = ?'
      params.push(req.user.id)
    }
    
    if (month) {
      query += ' AND month = ?'
      params.push(month)
    }
    if (year) {
      query += ' AND year = ?'
      params.push(parseInt(year.toString()))
    }
    if (paid !== undefined) {
      query += ' AND paid = ?'
      params.push(paid === 'true' ? 1 : 0)
    }
    if (residentId) {
      query += ' AND residentId = ?'
      params.push(residentId)
    }
    
    query += ' ORDER BY createdAt DESC'
    
    const payments = await dbAllWithParams(query, params)
    res.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    res.status(500).json({ error: 'Failed to fetch payments' })
  }
})

// GET /api/iuran/summary - Get payment summary
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query
    
    let query = 'SELECT * FROM iuran_payments WHERE 1=1'
    const params: any[] = []
    
    // Filter by resident's RT/RW based on user role
    if (req.user?.role === 'Contract') {
      query += ' AND residentId IN (SELECT id FROM residents WHERE rtId = ?)'
      params.push(req.user.rtId)
    } else if (req.user?.role === 'Owner') {
      query += ' AND residentId IN (SELECT id FROM residents WHERE rwId = ?)'
      params.push(req.user.rwId)
    } else if (req.user?.role === 'Resident') {
      query += ' AND residentId = ?'
      params.push(req.user.id)
    }
    
    if (month) {
      query += ' AND month = ?'
      params.push(month)
    }
    if (year) {
      query += ' AND year = ?'
      params.push(parseInt(year.toString()))
    }
    
    const payments = await dbAllWithParams(query, params)
    
    const total = payments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0)
    const paidCount = payments.filter(p => p.paid).length
    const unpaidCount = payments.filter(p => !p.paid).length
    
    res.json({
      total,
      paidCount,
      unpaidCount,
      totalCount: payments.length
    })
  } catch (error) {
    console.error('Error fetching iuran summary:', error)
    res.status(500).json({ error: 'Failed to fetch iuran summary' })
  }
})

// POST /api/iuran - Record payment
router.post('/', requireRole(['Contract', 'Owner']), async (req, res) => {
  try {
    const { residentId, month, year, amount } = req.body
    
    if (!residentId || !month || !year || !amount) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const now = new Date().toISOString()
    
    await dbRunWithParams(
      'INSERT INTO iuran_payments (id, residentId, month, year, amount, paid, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, residentId, month, parseInt(year), parseInt(amount), 0, now]
    )
    
    const payment = await dbGetWithParams('SELECT * FROM iuran_payments WHERE id = ?', [id])
    res.status(201).json(payment)
  } catch (error) {
    console.error('Error creating payment:', error)
    res.status(500).json({ error: 'Failed to create payment' })
  }
})

// PUT /api/iuran/:id/pay - Mark payment as paid
router.put('/:id/pay', requireRole(['Contract', 'Owner']), async (req, res) => {
  try {
    const now = new Date().toISOString()
    
    const result = await dbRunWithParams(
      'UPDATE iuran_payments SET paid = 1, paidAt = ? WHERE id = ?',
      [now, req.params.id]
    )
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Payment not found' })
    }
    
    const payment = await dbGetWithParams('SELECT * FROM iuran_payments WHERE id = ?', [req.params.id])
    res.json(payment)
  } catch (error) {
    console.error('Error marking payment as paid:', error)
    res.status(500).json({ error: 'Failed to mark payment as paid' })
  }
})

// PUT /api/iuran/:id - Update payment
router.put('/:id', requireRole(['Contract', 'Owner']), async (req, res) => {
  try {
    const { residentId, month, year, amount } = req.body
    
    if (!residentId || !month || !year || !amount) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    
    const result = await dbRunWithParams(
      'UPDATE iuran_payments SET residentId = ?, month = ?, year = ?, amount = ? WHERE id = ?',
      [residentId, month, parseInt(year), parseInt(amount), req.params.id]
    )
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Payment not found' })
    }
    
    const payment = await dbGetWithParams('SELECT * FROM iuran_payments WHERE id = ?', [req.params.id])
    res.json(payment)
  } catch (error) {
    console.error('Error updating payment:', error)
    res.status(500).json({ error: 'Failed to update payment' })
  }
})

// DELETE /api/iuran/:id - Delete payment
router.delete('/:id', requireRole(['Contract', 'Owner']), async (req, res) => {
  try {
    const result = await dbRunWithParams('DELETE FROM iuran_payments WHERE id = ?', [req.params.id])
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Payment not found' })
    }
    
    res.json({ message: 'Payment deleted successfully' })
  } catch (error) {
    console.error('Error deleting payment:', error)
    res.status(500).json({ error: 'Failed to delete payment' })
  }
})

// GET /api/iuran/reports - Generate reports
router.get('/reports', requireRole(['Contract', 'Owner']), async (req, res) => {
  try {
    const { type, year, month, quarter } = req.query
    
    let query = 'SELECT * FROM iuran_payments WHERE 1=1'
    const params: any[] = []
    
    // Filter by resident's RT/RW based on user role
    if (req.user?.role === 'Contract') {
      query += ' AND residentId IN (SELECT id FROM residents WHERE rtId = ?)'
      params.push(req.user.rtId)
    } else if (req.user?.role === 'Owner') {
      query += ' AND residentId IN (SELECT id FROM residents WHERE rwId = ?)'
      params.push(req.user.rwId)
    }
    
    if (year) {
      query += ' AND year = ?'
      params.push(parseInt(year.toString()))
    }
    
    if (type === 'monthly' && month) {
      query += ' AND month = ?'
      params.push(month)
    } else if (type === 'quarterly' && quarter) {
      const quarterMonths = {
        '1': ['01', '02', '03'],
        '2': ['04', '05', '06'],
        '3': ['07', '08', '09'],
        '4': ['10', '11', '12']
      }
      const months = quarterMonths[quarter as keyof typeof quarterMonths]
      if (months) {
        query += ' AND month IN (' + months.map(() => '?').join(',') + ')'
        params.push(...months)
      }
    }
    
    query += ' ORDER BY year DESC, month DESC, createdAt DESC'
    
    const payments = await dbAllWithParams(query, params)
    
    // Generate report data
    const report = {
      type: type || 'all',
      year: year ? parseInt(year.toString()) : null,
      month: month || null,
      quarter: quarter || null,
      totalPayments: payments.length,
      paidPayments: payments.filter(p => p.paid).length,
      unpaidPayments: payments.filter(p => !p.paid).length,
      totalAmount: payments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0),
      unpaidAmount: payments.filter(p => !p.paid).reduce((sum, p) => sum + p.amount, 0),
      payments: payments,
      generatedAt: new Date().toISOString()
    }
    
    res.json(report)
  } catch (error) {
    console.error('Error generating report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/iuran/export - Export payments to CSV
router.get('/export', requireRole(['Contract', 'Owner']), async (req, res) => {
  try {
    const { format = 'csv', type, year, month, quarter } = req.query
    
    let query = 'SELECT ip.*, r.name as residentName, r.house FROM iuran_payments ip JOIN residents r ON ip.residentId = r.id WHERE 1=1'
    const params: any[] = []
    
    // Filter by resident's RT/RW based on user role
    if (req.user?.role === 'Contract') {
      query += ' AND r.rtId = ?'
      params.push(req.user.rtId)
    } else if (req.user?.role === 'Owner') {
      query += ' AND r.rwId = ?'
      params.push(req.user.rwId)
    }
    
    if (year) {
      query += ' AND ip.year = ?'
      params.push(parseInt(year.toString()))
    }
    
    if (type === 'monthly' && month) {
      query += ' AND ip.month = ?'
      params.push(month)
    } else if (type === 'quarterly' && quarter) {
      const quarterMonths = {
        '1': ['01', '02', '03'],
        '2': ['04', '05', '06'],
        '3': ['07', '08', '09'],
        '4': ['10', '11', '12']
      }
      const months = quarterMonths[quarter as keyof typeof quarterMonths]
      if (months) {
        query += ' AND ip.month IN (' + months.map(() => '?').join(',') + ')'
        params.push(...months)
      }
    }
    
    query += ' ORDER BY ip.year DESC, ip.month DESC, ip.createdAt DESC'
    
    const payments = await dbAllWithParams(query, params)
    
    if (format === 'csv') {
      // Generate CSV
      const headers = ['ID', 'Resident Name', 'House', 'Month', 'Year', 'Amount', 'Status', 'Paid Date', 'Created Date']
      const csvRows = [headers.join(',')]
      
      payments.forEach(payment => {
        const row = [
          payment.id,
          `"${payment.residentName}"`,
          `"${payment.house}"`,
          payment.month,
          payment.year,
          payment.amount,
          payment.paid ? 'Paid' : 'Unpaid',
          payment.paidAt || '',
          payment.createdAt
        ]
        csvRows.push(row.join(','))
      })
      
      const csv = csvRows.join('\n')
      
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename="iuran-export-${new Date().toISOString().split('T')[0]}.csv"`)
      res.send(csv)
    } else {
      // Return JSON for other formats
      res.json({
        format,
        type: type || 'all',
        year: year ? parseInt(year.toString()) : null,
        month: month || null,
        quarter: quarter || null,
        totalPayments: payments.length,
        exportedAt: new Date().toISOString(),
        data: payments
      })
    }
  } catch (error) {
    console.error('Error exporting payments:', error)
    res.status(500).json({ error: 'Failed to export payments' })
  }
})

export { router as iuranRouter }
