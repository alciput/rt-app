import { ref, computed } from 'vue'
import { announcementsApi } from '@/services/api'
import type { Announcement } from '@/types'

const announcements = ref<Announcement[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useAnnouncements() {
  const fetchAnnouncements = async (filters?: { rtId?: string; rwId?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await announcementsApi.getAll(filters)
      announcements.value = response.data
      console.log('Fetched announcements:', response.data)
      console.log('Announcements with attachments:', response.data.filter((a: any) => a.attachments && a.attachments.length > 0))
    } catch (err) {
      error.value = 'Failed to fetch announcements'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createAnnouncement = async (data: { 
    title: string; 
    body: string; 
    content?: string;
    category?: string;
    visibility?: string;
    status?: string;
    publishDate?: string;
    expiryDate?: string;
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await announcementsApi.create(data)
      announcements.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create announcement'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAnnouncement = async (id: string, data: { 
    title?: string; 
    body?: string; 
    content?: string;
    category?: string;
    visibility?: string;
    status?: string;
    publishDate?: string;
    expiryDate?: string;
    archivedAt?: string;
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await announcementsApi.update(id, data)
      const index = announcements.value.findIndex(a => a.id === id)
      if (index !== -1) {
        announcements.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to update announcement'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteAnnouncement = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await announcementsApi.delete(id)
      const index = announcements.value.findIndex(a => a.id === id)
      if (index !== -1) {
        announcements.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Failed to delete announcement'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const recentAnnouncements = computed(() => 
    announcements.value
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, 5)
  )

  // Note: addReaction and addComment methods removed as the backend tables were deleted

  const addAttachment = async (announcementId: string, attachmentData: {
    fileName: string;
    fileType: string;
    fileSize: number;
    fileData: string;
  }) => {
    try {
      console.log('Composable: Adding attachment to announcement', announcementId, 'with data:', attachmentData);
      const response = await announcementsApi.addAttachment(announcementId, attachmentData)
      console.log('Composable: Attachment added successfully:', response.data);
      return response.data
    } catch (err) {
      console.error('Composable: Failed to add attachment:', err)
      throw err
    }
  }

  return {
    announcements,
    loading,
    error,
    recentAnnouncements,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addAttachment
  }
}
