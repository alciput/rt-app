<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay with blur effect -->
      <div 
        class="fixed inset-0 bg-gradient-to-br from-gray-900/50 to-blue-900/30 backdrop-blur-sm transition-opacity duration-300" 
        @click="close"
      ></div>

      <!-- Modal panel with beautiful design -->
      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Header with gradient background -->
        <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">Add New Resident</h3>
                <p class="text-blue-100 mt-1">Create a new community member profile</p>
              </div>
            </div>
            <button
              @click="close"
              class="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-full"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Form content -->
        <form @submit.prevent="handleSubmit" class="bg-gray-50">
          <div class="px-6 py-8">
            <!-- Personal Information Section -->
            <div class="mb-8">
              <div class="flex items-center mb-6">
                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Personal Information</h4>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Name -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Full Name <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <!-- House Number -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    House Number <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                      </svg>
                    </div>
                    <input
                      v-model="form.house"
                      type="text"
                      required
                      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder="e.g. A-01, B-15"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Location Information Section -->
            <div class="mb-8">
              <div class="flex items-center mb-6">
                <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Location Details</h4>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Cluster -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Cluster <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.cluster"
                    required
                    class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select Cluster</option>
                    <option value="Alium">🏢 Alium</option>
                    <option value="Boulevard">🌳 Boulevard</option>
                  </select>
                </div>

                <!-- Blok (conditional) -->
                <div v-if="form.cluster === 'Alium'" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Blok</label>
                  <select
                    v-model="form.blok"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select Blok</option>
                    <option value="A">🏠 Blok A</option>
                    <option value="B">🏠 Blok B</option>
                    <option value="C">🏠 Blok C</option>
                    <option value="D">🏠 Blok D</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Identity Information Section -->
            <div class="mb-8">
              <div class="flex items-center mb-6">
                <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Identity & Documents</h4>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- NIK KTP -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">NIK KTP</label>
                  <input
                    v-model="form.nikKtp"
                    type="text"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                    placeholder="Enter NIK KTP number"
                  />
                </div>

                <!-- KTP File Upload -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">KTP File (Optional)</label>
                  <div class="relative">
                    <input
                      @change="handleFileUpload"
                      type="file"
                      accept="image/*,.pdf"
                      class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">📄 Upload KTP image or PDF (optional) - Images will be automatically compressed</p>
                </div>
              </div>
            </div>

            <!-- Status & Role Section -->
            <div class="mb-8">
              <div class="flex items-center mb-6">
                <div class="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <svg class="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Status & Role</h4>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Status -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <div class="grid grid-cols-2 gap-3">
                    <label class="relative cursor-pointer">
                      <input
                        v-model="form.status"
                        type="radio"
                        value="active"
                        class="sr-only"
                      />
                      <div class="flex items-center justify-center px-4 py-3 border-2 rounded-xl transition-all duration-200"
                           :class="form.status === 'active' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 hover:border-gray-400'">
                        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Active
                      </div>
                    </label>
                    <label class="relative cursor-pointer">
                      <input
                        v-model="form.status"
                        type="radio"
                        value="inactive"
                        class="sr-only"
                      />
                      <div class="flex items-center justify-center px-4 py-3 border-2 rounded-xl transition-all duration-200"
                           :class="form.status === 'inactive' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 hover:border-gray-400'">
                        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Inactive
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Role -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Role</label>
                  <div class="grid grid-cols-2 gap-3">
                    <label class="relative cursor-pointer">
                      <input
                        v-model="form.role"
                        type="radio"
                        value="Contract"
                        class="sr-only"
                      />
                      <div class="flex items-center justify-center px-4 py-3 border-2 rounded-xl transition-all duration-200"
                           :class="form.role === 'Contract' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400'">
                        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Contract
                      </div>
                    </label>
                    <label class="relative cursor-pointer">
                      <input
                        v-model="form.role"
                        type="radio"
                        value="Owner"
                        class="sr-only"
                      />
                      <div class="flex items-center justify-center px-4 py-3 border-2 rounded-xl transition-all duration-200"
                           :class="form.role === 'Owner' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-300 hover:border-gray-400'">
                        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                        Owner
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
            </div>

            <!-- Administrative Information Section -->
            <div class="mb-6">
              <div class="flex items-center mb-6">
                <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <svg class="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Administrative Details</h4>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- RT -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">RT</label>
                  <select
                    v-model="form.rtId"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select RT</option>
                    <option value="01">01</option>
                  </select>
                </div>

                <!-- RW -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">RW</label>
                  <select
                    v-model="form.rwId"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select RW</option>
                    <option value="11">11</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer with beautiful buttons -->
          <div class="bg-white px-6 py-6 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
              <button
                type="button"
                @click="close"
                class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-xl text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm"
              >
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {{ loading ? 'Adding Resident...' : 'Add Resident' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useResidents } from '@/composables/useResidents'
import type { Resident } from '@/types'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  success: [resident: Resident]
}>()

const { createResident, loading } = useResidents()

const form = reactive({
  name: '',
  house: '',
  cluster: '' as 'Alium' | 'Boulevard' | '',
  blok: '',
  nikKtp: '',
  ktpFile: '',
  status: 'active' as 'active' | 'inactive',
  role: 'Contract' as 'Contract' | 'Owner',
  rtId: '',
  rwId: '',
})

const handleSubmit = async () => {
  try {
    const newResident = await createResident({
      name: form.name,
      house: form.house,
      cluster: form.cluster as 'Alium' | 'Boulevard',
      blok: form.blok || undefined,
      nikKtp: form.nikKtp || undefined,
      ktpFile: form.ktpFile || undefined,
      status: form.status,
      role: form.role,
      rtId: form.rtId,
      rwId: form.rwId,
    })
    
    emit('success', newResident)
    resetForm()
    close()
  } catch (error) {
    console.error('Error creating resident:', error)
    // Error handling is done in the composable
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // Check if it's an image or PDF
    if (file.type.startsWith('image/')) {
      // Compress image before converting to base64
      compressImage(file, (compressedBase64) => {
        form.ktpFile = compressedBase64
        console.log('Image compressed and converted to base64:', file.name)
      })
    } else {
      // For PDF files, convert directly to base64 without compression
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target?.result as string
        form.ktpFile = base64String
        console.log('PDF converted to base64:', file.name)
      }
      reader.readAsDataURL(file)
    }
  }
}

// Image compression function
const compressImage = (file: File, callback: (base64: string) => void) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  img.onload = () => {
    // Calculate new dimensions (max 800px width, maintain aspect ratio)
    const maxWidth = 800
    const maxHeight = 600
    let { width, height } = img
    
    if (width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }
    if (height > maxHeight) {
      width = (width * maxHeight) / height
      height = maxHeight
    }
    
    // Set canvas dimensions
    canvas.width = width
    canvas.height = height
    
    // Draw and compress
    ctx?.drawImage(img, 0, 0, width, height)
    
    // Convert to base64 with compression (0.8 quality)
    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
    callback(compressedBase64)
  }
  
  // Load the image
  const reader = new FileReader()
  reader.onload = (e) => {
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const resetForm = () => {
  form.name = ''
  form.house = ''
  form.cluster = ''
  form.blok = ''
  form.nikKtp = ''
  form.ktpFile = ''
  form.status = 'active'
  form.role = 'Contract'
  form.rtId = ''
  form.rwId = ''
}

const close = () => {
  console.log('Modal close function called')
  resetForm()
  emit('close')
}

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>