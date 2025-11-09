<template>
  <div class="space-y-4">
    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 sm:items-end">
      <div class="flex-1">
        <label class="text-sm text-gray-600">Search by house number</label>
        <input 
          v-model="filters.house" 
          type="text" 
          class="mt-1 w-full border rounded px-3 py-2" 
          placeholder="e.g. A-12" 
        />
      </div>
      <div>
        <label class="text-sm text-gray-600">Status</label>
        <select v-model="filters.status" class="mt-1 border rounded px-3 py-2">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label class="text-sm text-gray-600">Role</label>
        <select v-model="filters.role" class="mt-1 border rounded px-3 py-2">
          <option value="">All</option>
          <option value="Contract">Contract</option>
          <option value="Owner">Owner</option>
        </select>
      </div>
      <button 
        v-if="canCreate"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" 
        @click="$emit('create')"
      >
        Add Resident
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white border rounded overflow-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left p-3">Name</th>
            <th class="text-left p-3">House</th>
            <th class="text-left p-3">Status</th>
            <th class="text-left p-3">Role</th>
            <th v-if="canEdit" class="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resident in filteredResidents" :key="resident.id" class="border-t hover:bg-gray-50">
            <td class="p-3">{{ resident.name }}</td>
            <td class="p-3">{{ resident.house }}</td>
            <td class="p-3">
              <span 
                :class="resident.status === 'active' ? 'text-green-600' : 'text-gray-500'"
                class="px-2 py-1 rounded text-xs"
                :class="resident.status === 'active' ? 'bg-green-100' : 'bg-gray-100'"
              >
                {{ resident.status }}
              </span>
            </td>
            <td class="p-3">{{ resident.role }}</td>
            <td v-if="canEdit" class="p-3 flex gap-2">
              <button 
                class="px-3 py-1 border rounded hover:bg-gray-50" 
                @click="$emit('edit', resident)"
              >
                Edit
              </button>
              <button 
                v-if="canDelete"
                class="px-3 py-1 border rounded text-red-600 hover:bg-red-50" 
                @click="$emit('delete', resident.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-4 text-gray-500">
      Loading residents...
    </div>

    <!-- Error state -->
    <div v-if="error" class="text-center py-4 text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { Resident } from '@/types'

interface Props {
  residents: Resident[]
  loading?: boolean
  error?: string | null
  canCreate?: boolean
  canEdit?: boolean
  canDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  canCreate: true,
  canEdit: true,
  canDelete: true,
})

const emit = defineEmits<{
  create: []
  edit: [resident: Resident]
  delete: [id: string]
}>()

const filters = reactive({ house: '', status: '', role: '' })

const filteredResidents = computed(() => 
  props.residents.filter(r => {
    const f1 = !filters.house || r.house.toLowerCase().includes(filters.house.toLowerCase())
    const f2 = !filters.status || r.status === (filters.status as any)
    const f3 = !filters.role || r.role === (filters.role as any)
    return f1 && f2 && f3
  })
)
</script>
