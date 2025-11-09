import { ref, computed } from 'vue'
import { residentsApi } from '@/services/api'
import type { Resident } from '@/types'

const residents = ref<Resident[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useResidents() {
  const fetchResidents = async (filters?: { house?: string; status?: string; role?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await residentsApi.getAll(filters)
      residents.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch residents'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createResident = async (data: Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null
    try {
      const response = await residentsApi.create(data)
      residents.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create resident'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateResident = async (id: string, data: Partial<Resident>) => {
    loading.value = true
    error.value = null
    try {
      console.log('useResidents: Updating resident', id, 'with data:', data)
      const response = await residentsApi.update(id, data)
      console.log('useResidents: API response:', response.data)
      
      const index = residents.value.findIndex(r => r.id === id)
      console.log('useResidents: Found resident at index:', index)
      
      if (index !== -1) {
        console.log('useResidents: Before update:', residents.value[index])
        // Create a new array to trigger reactivity
        const updatedResidents = [...residents.value]
        updatedResidents[index] = response.data
        residents.value = updatedResidents
        console.log('useResidents: After update:', residents.value[index])
      } else {
        console.log('useResidents: Resident not found in local array')
      }
      
      return response.data
    } catch (err) {
      error.value = 'Failed to update resident'
      console.error('useResidents: Update error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteResident = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await residentsApi.delete(id)
      const index = residents.value.findIndex(r => r.id === id)
      if (index !== -1) {
        residents.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Failed to delete resident'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }


  const activeResidents = computed(() => residents.value.filter(r => r.status === 'active'))
  const inactiveResidents = computed(() => residents.value.filter(r => r.status === 'inactive'))

  return {
    residents,
    loading,
    error,
    activeResidents,
    inactiveResidents,
    fetchResidents,
    createResident,
    updateResident,
    deleteResident,
  }
}
