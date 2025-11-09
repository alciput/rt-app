<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Test Edit Functionality</h1>
    
    <!-- Test Edit Resident -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Test Edit Resident</h2>
      <p class="text-gray-600 mb-4">Click the button below to test editing a resident.</p>
      <button 
        @click="testEditResident"
        class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
      >
        Test Edit Resident
      </button>
    </div>


    <!-- Debug Info -->
    <div class="bg-gray-50 rounded-lg p-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Debug Info</h3>
      <div class="text-sm text-gray-600">
        <p>Selected Resident: {{ selectedResident ? selectedResident.name : 'None' }}</p>
        <p>Show Edit Resident Modal: {{ showEditModal }}</p>
      </div>
    </div>

    <!-- Modals -->
    <EditResidentModal 
      :is-open="showEditModal" 
      :resident="selectedResident"
      @close="showEditModal = false"
      @success="handleResidentUpdated"
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EditResidentModal from '@/components/admin/EditResidentModal.vue'
import type { Resident } from '@/types'

const showEditModal = ref(false)
const selectedResident = ref<Resident | null>(null)

function testEditResident() {
  // Create a mock resident for testing
  selectedResident.value = {
    id: 'test-resident-1',
    name: 'Test Resident',
    house: 'A-01',
    status: 'active',
    role: 'Contract',
    rtId: 'rt1',
    rwId: 'rw1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  showEditModal.value = true
  console.log('Opening edit resident modal with:', selectedResident.value)
}

function handleResidentUpdated(resident: Resident) {
  console.log('Resident updated successfully:', resident)
  alert(`Resident "${resident.name}" updated successfully!`)
}
</script>
