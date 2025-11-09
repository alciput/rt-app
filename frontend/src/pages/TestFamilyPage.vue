<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Resident Test Page</h1>
    
    <!-- Add Resident Card -->
    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
      <div class="flex items-center mb-4">
        <div class="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Add Resident</h2>
      </div>
      <p class="text-gray-600 mb-4">Add individual residents to the system.</p>
      <div class="space-y-2 text-sm text-gray-500">
        <p>• Individual person registration</p>
        <p>• Basic info: name, house, status, role</p>
        <p>• Creates 1 resident record</p>
      </div>
      <button 
        @click="showAddResidentModal = true"
        class="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span>Test Add Resident</span>
      </button>
    </div>

    <!-- Modals -->
    <AddResidentModal 
      :is-open="showAddResidentModal" 
      @close="showAddResidentModal = false"
      @success="handleResidentAdded"
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AddResidentModal from '@/components/admin/AddResidentModal.vue'
import type { Resident } from '@/types'

const showAddResidentModal = ref(false)

function handleResidentAdded(resident: Resident) {
  console.log('Resident added:', resident)
  alert(`✅ Resident "${resident.name}" added successfully!`)
}

</script>
