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
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Import Residents from CSV</h3>
              

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
                  <div class="flex space-x-3 justify-center">
                    <button
                      @click="removeFile"
                      class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Remove
                    </button>
                    <button
                      @click="importFile"
                      :disabled="importing"
                      class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <svg v-if="importing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ importing ? 'Importing...' : 'Import File' }}
                    </button>
                  </div>
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

              <!-- Import Results -->
              <div v-if="importResults" class="mt-6 p-4 rounded-lg" :class="importResults.success > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
                <h4 class="text-sm font-medium mb-2" :class="importResults.success > 0 ? 'text-green-800' : 'text-red-800'">
                  Import Results
                </h4>
                <div class="text-sm space-y-1">
                  <p :class="importResults.success > 0 ? 'text-green-700' : 'text-red-700'">
                    ✅ Success: {{ importResults.success }} residents imported
                  </p>
                  <p v-if="importResults.errors > 0" class="text-red-700">
                    ❌ Errors: {{ importResults.errors }} residents failed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="close"
            class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  import: [file: File]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragOver = ref(false)
const importing = ref(false)
const importResults = ref<{ success: number; errors: number } | null>(null)

const close = () => {
  selectedFile.value = null
  isDragOver.value = false
  importing.value = false
  importResults.value = null
  emit('close')
}


const triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.type === 'text/csv' || file?.name.endsWith('.csv')) {
    selectedFile.value = file
  } else {
    alert('Please select a valid CSV file.')
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      selectedFile.value = file
    } else {
      alert('Please drop a valid CSV file.')
    }
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const importFile = () => {
  if (selectedFile.value) {
    importing.value = true
    emit('import', selectedFile.value)
  }
}

// Expose method to set import results
const setImportResults = (results: { success: number; errors: number }) => {
  importResults.value = results
  importing.value = false
}

defineExpose({ setImportResults })
</script>
