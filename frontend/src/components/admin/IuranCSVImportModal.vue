<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="close"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Import Iuran Payments from CSV</h3>
              
              <!-- Drag & Drop Area -->
              <div 
                @drop="handleDrop"
                @dragover="handleDragOver"
                @dragenter="handleDragEnter"
                @dragleave="handleDragLeave"
                :class="[
                  'border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
                  isDragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                ]"
              >
                <div v-if="!selectedFile" class="space-y-4">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                  </svg>
                  <div>
                    <p class="text-lg font-medium text-gray-900">Drop your CSV file here</p>
                    <p class="text-sm text-gray-500 mt-1">or click to browse files</p>
                  </div>
                  <button
                    @click="triggerFileSelect"
                    class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                  >
                    Choose File
                  </button>
                </div>

                <div v-else class="space-y-4">
                  <svg class="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p class="text-lg font-medium text-gray-900">{{ selectedFile.name }}</p>
                    <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                  <button
                    @click="removeFile"
                    class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Remove File
                  </button>
                </div>
              </div>

              <!-- Hidden file input -->
              <input
                ref="fileInput"
                type="file"
                accept=".csv"
                @change="handleFileSelect"
                class="hidden"
              />

              <!-- Template Download -->
              <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-blue-900">Need a template?</p>
                    <p class="text-xs text-blue-700">Download our CSV template to get started</p>
                  </div>
                  <button
                    @click="downloadTemplate"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                  >
                    Download Template
                  </button>
                </div>
              </div>

              <!-- Import Instructions -->
              <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 class="text-sm font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
                <ul class="text-xs text-gray-600 space-y-1">
                  <li>• <strong>ID:</strong> Payment ID (optional - leave empty for new payments)</li>
                  <li>• <strong>Resident ID:</strong> Family head resident ID (required) - use exported CSV format</li>
                  <li>• <strong>Month:</strong> Month in MM format (01-12)</li>
                  <li>• <strong>Year:</strong> Year in YYYY format</li>
                  <li>• <strong>Amount:</strong> Payment amount in Rupiah</li>
                  <li>• <strong>Paid:</strong> true/false or "Paid"/"Unpaid" (optional, defaults to false)</li>
                </ul>
                <div class="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  <strong>Note:</strong> You can import exported CSV files directly. The system will automatically map "Resident Name" to the correct "Resident ID".
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="handleImport"
            :disabled="!selectedFile || importing"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="importing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ importing ? 'Importing...' : 'Import CSV' }}
          </button>
          <button
            @click="close"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { parseCSV } from '@/utils/csv'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'import', data: any[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isDragOver = ref(false)
const importing = ref(false)

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      selectedFile.value = file
    } else {
      alert('Please select a CSV file')
    }
  }
}

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
  }
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadTemplate = () => {
  const template = [
    ['ID', 'Resident ID', 'Month', 'Year', 'Amount', 'Paid'],
    ['', 'head_1', '01', '2025', '100000', 'false'],
    ['', 'head_2', '01', '2025', '100000', 'true'],
    ['', 'head_3', '01', '2025', '100000', 'false']
  ]
  
  const csvContent = template.map(row => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'iuran-template.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

const handleImport = async () => {
  if (!selectedFile.value) return
  
  importing.value = true
  
  try {
    const text = await selectedFile.value.text()
    const data = parseCSV(text)
    
    // Validate CSV structure
    if (data.length === 0) {
      alert('CSV file is empty')
      return
    }
    
    const headers = data[0]
    const requiredHeaders = ['Month', 'Year', 'Amount']
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header))
    
    // Check for either Resident ID or Resident Name
    const hasResidentId = headers.includes('Resident ID')
    const hasResidentName = headers.includes('Resident Name')
    
    if (missingHeaders.length > 0) {
      alert(`Missing required columns: ${missingHeaders.join(', ')}`)
      return
    }
    
    if (!hasResidentId && !hasResidentName) {
      alert('Missing required column: Either "Resident ID" or "Resident Name" is required')
      return
    }
    
    emit('import', data)
    close()
  } catch (error) {
    console.error('Error parsing CSV:', error)
    alert('Error parsing CSV file. Please check the format.')
  } finally {
    importing.value = false
  }
}

const close = () => {
  selectedFile.value = null
  isDragOver.value = false
  importing.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('close')
}
</script>
