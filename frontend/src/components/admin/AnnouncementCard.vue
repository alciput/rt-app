<template>
  <div class="bg-white border rounded p-4 space-y-3">
    <div class="flex items-start justify-between">
      <h3 class="font-medium text-lg">{{ announcement.title }}</h3>
      <div v-if="canEdit" class="flex gap-2">
        <button 
          class="text-blue-600 hover:text-blue-800 text-sm" 
          @click="$emit('edit', announcement)"
        >
          Edit
        </button>
        <button 
          v-if="canDelete"
          class="text-red-600 hover:text-red-800 text-sm" 
          @click="$emit('delete', announcement.id)"
        >
          Delete
        </button>
      </div>
    </div>
    
    <p class="text-gray-700">{{ announcement.body }}</p>
    
    <div class="flex items-center justify-between text-sm text-gray-500">
      <span>{{ formatDate(announcement.createdAt) }}</span>
      <span v-if="announcement.authorId" class="px-2 py-1 bg-gray-100 rounded">
        {{ getAuthorName(announcement.authorId) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Announcement } from '@/types'

interface Props {
  announcement: Announcement
  canEdit?: boolean
  canDelete?: boolean
  authors?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: true,
  canDelete: true,
  authors: () => ({})
})

const emit = defineEmits<{
  edit: [announcement: Announcement]
  delete: [id: string]
}>()

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown date'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getAuthorName = (authorId: string) => {
  return props.authors?.[authorId] || 'Unknown Author'
}
</script>
