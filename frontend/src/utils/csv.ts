import type { Resident } from '@/types'

export interface CSVResident {
  id?: string
  name: string
  house: string
  cluster: string
  blok?: string
  nikKtp?: string
  ktpFile?: string
  status: string
  role: string
  rt?: string
  rw?: string
  familyId?: string
  relationship?: string
  age?: number
}

/**
 * Convert residents data to CSV format
 */
export function exportResidentsToCSV(residents: Resident[]): string {
  const headers = [
    'ID',
    'Name',
    'House',
    'Cluster',
    'Blok',
    'NIK KTP',
    'KTP File',
    'Status',
    'Role',
    'RT',
    'RW',
    'Family ID',
    'Relationship',
    'Age',
  ]

  const csvData = residents.map(resident => [
    resident.id,
    resident.name,
    resident.house,
    resident.cluster,
    resident.blok || '',
    resident.nikKtp || '',
    resident.ktpFile || '',
    resident.status,
    resident.role,
    resident.rtId || '',
    resident.rwId || '',
    resident.familyId || '',
    resident.relationship || '',
    resident.age?.toString() || '',
  ])

  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  return csvContent
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'residents.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

/**
 * Generic CSV parser that returns a 2D array
 */
export function parseCSV(csvContent: string): string[][] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  
  if (lines.length === 0) {
    return []
  }

  return lines.map((line, index) => {
    const values: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''))
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''))
    
    console.log(`Parsed CSV line ${index + 1}:`, { line: line.substring(0, 100), values })
    
    return values
  })
}

/**
 * Parse CSV content to residents data
 */
export function parseCSVToResidents(csvContent: string): CSVResident[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header row and one data row')
  }

  const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim())
  const dataLines = lines.slice(1)

  return dataLines.map((line, index) => {
    // Handle CSV parsing more carefully to avoid field shifting
    // Use a more robust CSV parsing that handles quoted fields with commas
    const values: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    
    console.log(`Parsing CSV row ${index + 2}:`, { line: line.substring(0, 100) + '...', values: values.map(v => v.substring(0, 50) + (v.length > 50 ? '...' : '')), headers })
    
    if (values.length !== headers.length) {
      console.warn(`CSV row has ${values.length} columns but expected ${headers.length}. Row: ${line.substring(0, 100)}...`)
      // Pad with empty strings if too short
      while (values.length < headers.length) {
        values.push('')
      }
    }

    const resident: any = {}
    headers.forEach((header, index) => {
      const value = values[index] || ''
      switch (header.toLowerCase()) {
        case 'id':
          resident.id = value || undefined
          break
        case 'name':
          resident.name = value
          break
        case 'house':
          resident.house = value
          break
        case 'cluster':
          resident.cluster = value
          break
        case 'blok':
          resident.blok = value && value.trim() !== '' ? value : undefined
          break
        case 'nik ktp':
          resident.nikKtp = value && value.trim() !== '' ? value : undefined
          break
        case 'ktp file':
          resident.ktpFile = value && value.trim() !== '' ? value : undefined
          break
        case 'status':
          resident.status = value?.trim() || ''
          break
        case 'role':
          resident.role = value?.trim() || ''
          break
        case 'rt':
          resident.rt = value && value.trim() !== '' ? value : undefined
          break
        case 'rw':
          resident.rw = value && value.trim() !== '' ? value : undefined
          break
        case 'family id':
          resident.familyId = value && value.trim() !== '' ? value : undefined
          break
        case 'relationship':
          resident.relationship = value && value.trim() !== '' ? value : undefined
          break
        case 'age':
          resident.age = value && value.trim() !== '' ? parseInt(value) : undefined
          break
      }
    })

    console.log(`Parsed resident ${index + 2}:`, resident)
    return resident as CSVResident
  })
}

/**
 * Validate CSV resident data
 */
export function validateCSVResident(resident: CSVResident): string[] {
  const errors: string[] = []

  // Debug logging
  console.log('Validating resident:', {
    name: resident.name,
    status: resident.status,
    role: resident.role,
    statusType: typeof resident.status,
    roleType: typeof resident.role,
    allFields: Object.keys(resident).map(key => ({ [key]: resident[key] }))
  })

  if (!resident.name || resident.name.trim() === '') {
    errors.push('Name is required')
  }

  if (!resident.house || resident.house.trim() === '') {
    errors.push('House is required')
  }

  if (!resident.cluster || !['Alium', 'Boulevard'].includes(resident.cluster)) {
    errors.push('Cluster must be either "Alium" or "Boulevard"')
  }

  // Blok validation is optional for Alium cluster
  if (resident.cluster === 'Alium' && resident.blok && !['A', 'B', 'C', 'D'].includes(resident.blok)) {
    errors.push('Blok must be A, B, C, or D for Alium cluster (or leave empty)')
  }

  // More robust status validation
  const statusValue = resident.status?.toString().trim().toLowerCase()
  if (!statusValue || !['active', 'inactive'].includes(statusValue)) {
    // Check if status field contains base64 data (common issue with CSV parsing)
    if (statusValue && statusValue.includes('/9j/') && statusValue.includes('base64')) {
      errors.push(`Status field appears to contain base64 image data instead of status value. This suggests a CSV parsing issue.`)
    } else {
      errors.push(`Status must be either "active" or "inactive" (got: "${resident.status}")`)
    }
  }

  // More robust role validation
  const roleValue = resident.role?.toString().trim()
  if (!roleValue || !['Contract', 'Owner'].includes(roleValue)) {
    // Check if role field contains base64 data
    if (roleValue && roleValue.includes('/9j/') && roleValue.includes('base64')) {
      errors.push(`Role field appears to contain base64 image data instead of role value. This suggests a CSV parsing issue.`)
    } else {
      errors.push(`Role must be either "Contract" or "Owner" (got: "${resident.role}")`)
    }
  }

  return errors
}
