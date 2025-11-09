<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Test Update Functionality</h1>
    
    <!-- Current Data -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Current Residents Data</h2>
      <div v-if="loading" class="text-center py-4">Loading...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else class="space-y-2">
        <div v-for="resident in residents" :key="resident.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <span class="font-medium">{{ resident.name }}</span>
            <span class="text-gray-500 ml-2">({{ resident.house }})</span>
          </div>
          <button 
            @click="testUpdateResident(resident)"
            class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Test Update
          </button>
        </div>
      </div>
    </div>

    <!-- Test Results -->
    <div class="bg-gray-50 rounded-lg p-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Test Results</h3>
      <div class="text-sm text-gray-600 space-y-1">
        <p>Last Update: {{ lastUpdate || 'None' }}</p>
        <p>Update Success: {{ updateSuccess ? 'Yes' : 'No' }}</p>
        <p>Data Refreshed: {{ dataRefreshed ? 'Yes' : 'No' }}</p>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditResidentModal 
      :is-open="showEditModal" 
      :resident="selectedResident"
      @close="showEditModal = false"
      @success="handleResidentUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useResidents } from '@/composables/useResidents'
import EditResidentModal from '@/components/admin/EditResidentModal.vue'
import type { Resident } from '@/types'

const { residents, loading, error, fetchResidents, updateResident } = useResidents()

const showEditModal = ref(false)
const selectedResident = ref<Resident | null>(null)
const lastUpdate = ref<string | null>(null)
const updateSuccess = ref(false)
const dataRefreshed = ref(false)

function testUpdateResident(resident: Resident) {
  selectedResident.value = resident
  showEditModal.value = true
  console.log('Testing update for resident:', resident)
}

function handleResidentUpdated(resident: Resident) {
  console.log('Resident updated successfully:', resident)
  lastUpdate.value = new Date().toLocaleString()
  updateSuccess.value = true
  
  // Refresh data
  fetchResidents().then(() => {
    dataRefreshed.value = true
    console.log('Data refreshed, new residents:', residents.value)
  })
}

onMounted(() => {
  fetchResidents()
})
</script>
