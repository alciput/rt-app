<template>
  <div class="space-y-4">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border rounded p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Collected</p>
            <p class="text-xl font-semibold">Rp {{ formatCurrency(summary.total) }}</p>
          </div>
          <div class="p-2 bg-green-100 rounded">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white border rounded p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Paid</p>
            <p class="text-xl font-semibold">{{ summary.paidCount }}</p>
          </div>
          <div class="p-2 bg-blue-100 rounded">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white border rounded p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Unpaid</p>
            <p class="text-xl font-semibold">{{ summary.unpaidCount }}</p>
          </div>
          <div class="p-2 bg-red-100 rounded">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 items-end">
      <div>
        <label class="text-sm text-gray-600">Month</label>
        <select v-model="filters.month" class="mt-1 border rounded px-3 py-2">
          <option value="">All Months</option>
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
      </div>
      <div>
        <label class="text-sm text-gray-600">Year</label>
        <select v-model="filters.year" class="mt-1 border rounded px-3 py-2">
          <option value="">All Years</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <button 
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" 
        @click="$emit('filter', filters)"
      >
        Apply Filter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'

interface Props {
  summary: {
    total: number
    paidCount: number
    unpaidCount: number
    totalCount: number
  }
}

defineProps<Props>()

const emit = defineEmits<{
  filter: [filters: { month?: string; year?: number }]
}>()

const filters = reactive({ month: '', year: '' })

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - i)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID').format(amount)
}
</script>
