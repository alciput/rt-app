<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-white border rounded p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Residents</p>
          <p class="text-2xl font-semibold">{{ totals.residents }}</p>
        </div>
        <div class="p-2 bg-blue-100 rounded">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white border rounded p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pending Requests</p>
          <p class="text-2xl font-semibold">{{ totals.pendingRequests }}</p>
        </div>
        <div class="p-2 bg-yellow-100 rounded">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white border rounded p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Active RTs</p>
          <p class="text-2xl font-semibold">{{ totals.activeRTs }}</p>
        </div>
        <div class="p-2 bg-green-100 rounded">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white border rounded p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Unpaid Iuran</p>
          <p class="text-2xl font-semibold">{{ totals.unpaidIuran }}</p>
        </div>
        <div class="p-2 bg-red-100 rounded">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totals: {
    residents: number
    pendingRequests: number
    activeRTs: number
    unpaidIuran: number
  }
}

defineProps<Props>()
</script>
