import { ref, computed } from 'vue'
import { iuranApi } from '@/services/api'
import { useResidents } from './useResidents'
import type { IuranPayment } from '@/types'

const payments = ref<IuranPayment[]>([])
const summary = ref({ total: 0, paidCount: 0, unpaidCount: 0, totalCount: 0 })
const loading = ref(false)
const error = ref<string | null>(null)

export function useIuran() {
  const fetchPayments = async (filters?: { month?: string; year?: number; paid?: boolean; residentId?: string }) => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching payments with filters:', filters)
      const response = await iuranApi.getAll(filters)
      console.log('Fetched payments from API:', response.data)
      payments.value = response.data
      console.log('Payments value updated:', payments.value)
    } catch (err) {
      error.value = 'Failed to fetch payments'
      console.error('Error fetching payments:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchSummary = async (filters?: { month?: string; year?: number }) => {
    loading.value = true
    error.value = null
    try {
      const response = await iuranApi.getSummary(filters)
      summary.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch summary'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createPayment = async (data: { residentId: string; month: string; year: number; amount: number }) => {
    loading.value = true
    error.value = null
    try {
      const response = await iuranApi.create(data)
      payments.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create payment'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const markPaid = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await iuranApi.markPaid(id)
      const index = payments.value.findIndex(p => p.id === id)
      if (index !== -1) {
        payments.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to mark payment as paid'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePayment = async (id: string, data: { residentId: string; month: string; year: number; amount: number }) => {
    loading.value = true
    error.value = null
    try {
      const response = await iuranApi.update(id, data)
      const index = payments.value.findIndex(p => p.id === id)
      if (index !== -1) {
        payments.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to update payment'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePayment = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await iuranApi.delete(id)
      const index = payments.value.findIndex(p => p.id === id)
      if (index !== -1) {
        payments.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Failed to delete payment'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const generateReport = async (params?: { type?: string; year?: number; month?: string; quarter?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await iuranApi.getReports(params)
      return response.data
    } catch (err) {
      error.value = 'Failed to generate report'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const exportPayments = async (params?: { format?: string; type?: string; year?: number; month?: string; quarter?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await iuranApi.export(params)
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `iuran-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return response.data
    } catch (err) {
      error.value = 'Failed to export payments'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const importPayments = async (csvData: any[][]) => {
    loading.value = true
    error.value = null
    try {
      const { residents, fetchResidents } = useResidents()
      await fetchResidents() // Ensure residents are loaded
      
      console.log('Loaded residents for import:', residents.value.length)
      console.log('Resident names:', residents.value.map(r => r.name))
      
      const headers = csvData[0]
      const dataRows = csvData.slice(1)
      
      const results = []
      
      for (const row of dataRows) {
        if (row.every(cell => !cell || cell.trim() === '')) continue // Skip empty rows
        
        const rowData: any = {}
        headers.forEach((header, index) => {
          const cleanHeader = header.toLowerCase().replace(/\s+/g, '')
          rowData[cleanHeader] = row[index] || ''
          // Also map common variations
          if (cleanHeader === 'residentname') {
            rowData['residentname'] = row[index] || ''
          }
        })
        
        console.log('Processing CSV row:', { headers, row, rowData })
        
        // Map CSV columns to API format
        const paymentData = {
          id: rowData.id || undefined,
          residentId: rowData.residentid, // Only use actual resident ID
          month: rowData.month,
          year: parseInt(rowData.year),
          amount: parseInt(rowData.amount),
          paid: rowData.paid === 'true' || rowData.paid === true || rowData.status === 'Paid'
        }
        
        // If we have resident name instead of ID, try to find the resident ID
        if (!paymentData.residentId && rowData.residentname) {
          // Clean the resident name (remove quotes and trim)
          const cleanName = rowData.residentname.replace(/"/g, '').trim()
          console.log(`Looking for resident with cleaned name: "${cleanName}"`)
          
          // Try to find resident by name (exact match)
          const residentsWithName = residents.value.filter(r => r.name === cleanName)
          console.log(`Found ${residentsWithName.length} residents with name "${cleanName}":`, residentsWithName.map(r => ({ id: r.id, name: r.name, house: r.house })))
          
          if (residentsWithName.length > 0) {
            // Use the first match (you might want to add more logic here to choose the right one)
            const resident = residentsWithName[0]
            paymentData.residentId = resident.id
            console.log(`Using resident ID for name "${cleanName}": ${resident.id}`)
            console.log(`Updated paymentData.residentId from "${cleanName}" to "${resident.id}"`)
          } else {
            console.warn(`Could not find resident with name: "${cleanName}"`)
            console.log('Available residents:', residents.value.map(r => ({ name: r.name, id: r.id })))
          }
        }
        
        console.log('Final paymentData before API call:', paymentData)
        
        // Validate required fields
        if (!paymentData.residentId || !paymentData.month || !paymentData.year || !paymentData.amount) {
          console.warn('Skipping invalid row:', row, 'Missing required fields:', {
            residentId: paymentData.residentId,
            month: paymentData.month,
            year: paymentData.year,
            amount: paymentData.amount
          })
          continue
        }
        
        try {
          if (paymentData.id) {
            // Update existing payment
            console.log('Updating existing payment:', paymentData.id, 'with data:', paymentData)
            const response = await iuranApi.update(paymentData.id, {
              residentId: paymentData.residentId,
              month: paymentData.month,
              year: paymentData.year,
              amount: paymentData.amount
            })
            results.push({ success: true, data: response.data, action: 'updated' })
            console.log('Updated payment response:', response.data)
          } else {
            // Create new payment
            console.log('Creating new payment with data:', paymentData)
            const response = await iuranApi.create({
              residentId: paymentData.residentId,
              month: paymentData.month,
              year: paymentData.year,
              amount: paymentData.amount
            })
            results.push({ success: true, data: response.data, action: 'created' })
            console.log('Created payment response:', response.data)
            
            // Mark as paid if specified
            if (paymentData.paid) {
              console.log('Marking payment as paid:', response.data.id)
              await iuranApi.markPaid(response.data.id)
            }
          }
        } catch (err) {
          console.error('Error processing row:', row, err)
          console.error('Error details:', err.response?.data || err.message)
          results.push({ success: false, error: err, row })
        }
      }
      
      // Refresh payments list
      console.log('Refreshing payments list...')
      await fetchPayments()
      await fetchSummary()
      
      console.log('Import completed. Results:', results)
      console.log('Total payments after import:', payments.value.length)
      console.log('All payments:', payments.value)
      console.log('Summary after import:', summary.value)
      
      return results
    } catch (err) {
      error.value = 'Failed to import payments'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const paidPayments = computed(() => payments.value.filter(p => p.paid))
  const unpaidPayments = computed(() => payments.value.filter(p => !p.paid))
  const totalCollected = computed(() => paidPayments.value.reduce((sum, p) => sum + p.amount, 0))

  return {
    payments,
    summary,
    loading,
    error,
    paidPayments,
    unpaidPayments,
    totalCollected,
    fetchPayments,
    fetchSummary,
    createPayment,
    markPaid,
    updatePayment,
    deletePayment,
    generateReport,
    exportPayments,
    importPayments,
  }
}
