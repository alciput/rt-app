<template>
  <div class="bg-white border rounded p-4 space-y-3">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="font-medium">{{ request.type }}</h3>
        <p v-if="request.description" class="text-sm text-gray-600 mt-1">
          {{ request.description }}
        </p>
      </div>
      <span 
        :class="getStatusColor(request.status)"
        class="px-2 py-1 rounded text-xs font-medium"
        :class="getStatusBg(request.status)"
      >
        {{ formatStatus(request.status) }}
      </span>
    </div>
    
    <div class="flex items-center justify-between text-sm text-gray-500">
      <span>{{ formatDate(request.createdAt) }}</span>
      <div v-if="canApprove" class="flex gap-2">
        <button 
          v-if="canApproveRt && request.status === 'pending'"
          class="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700" 
          @click="$emit('approve-rt', request.id)"
        >
          Approve RT
        </button>
        <button 
          v-if="canApproveRw && request.status === 'rt-approved'"
          class="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700" 
          @click="$emit('approve-rw', request.id)"
        >
          Approve RW
        </button>
        <button 
          v-if="canApproveAdmin && request.status === 'rw-approved'"
          class="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700" 
          @click="$emit('approve-admin', request.id)"
        >
          Approve Admin
        </button>
        <button 
          v-if="canReject && request.status !== 'rejected'"
          class="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700" 
          @click="$emit('reject', request.id)"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SuratRequest, SuratStatus } from '@/types'

interface Props {
  request: SuratRequest
  canApprove?: boolean
  canApproveRt?: boolean
  canApproveRw?: boolean
  canApproveAdmin?: boolean
  canReject?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canApprove: false,
  canApproveRt: false,
  canApproveRw: false,
  canApproveAdmin: false,
  canReject: false,
})

const emit = defineEmits<{
  'approve-rt': [id: string]
  'approve-rw': [id: string]
  'approve-admin': [id: string]
  reject: [id: string]
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatStatus = (status: SuratStatus) => {
  switch (status) {
    case 'pending': return 'Pending'
    case 'rt-approved': return 'RT Approved'
    case 'rw-approved': return 'RW Approved'
    case 'admin-approved': return 'Admin Approved'
    case 'rejected': return 'Rejected'
    default: return status
  }
}

const getStatusColor = (status: SuratStatus) => {
  switch (status) {
    case 'pending': return 'text-yellow-600'
    case 'rt-approved': return 'text-blue-600'
    case 'rw-approved': return 'text-indigo-600'
    case 'admin-approved': return 'text-green-600'
    case 'rejected': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

const getStatusBg = (status: SuratStatus) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100'
    case 'rt-approved': return 'bg-blue-100'
    case 'rw-approved': return 'bg-indigo-100'
    case 'admin-approved': return 'bg-green-100'
    case 'rejected': return 'bg-red-100'
    default: return 'bg-gray-100'
  }
}
</script>
