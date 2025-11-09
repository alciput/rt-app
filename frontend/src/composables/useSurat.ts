import { ref, computed } from 'vue'
import { suratApi } from '@/services/api'
import type { SuratRequest, SuratStatus } from '@/types'

const requests = ref<SuratRequest[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useSurat() {
  const fetchRequests = async () => {
    loading.value = true
    error.value = null
    try {
      console.log('🔄 Fetching surat requests...')
      const response = await suratApi.getAll()
      console.log('📊 Fetched surat requests:', response.data)
      console.log('📊 Total requests:', response.data.length)
      
      // Log status counts for debugging
      const statusCounts = response.data.reduce((acc, req) => {
        acc[req.status] = (acc[req.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      console.log('📊 Status counts:', statusCounts)
      
      requests.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch surat requests'
      console.error('❌ Error fetching surat requests:', err)
    } finally {
      loading.value = false
    }
  }

  const createRequest = async (data: { type: string; description?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await suratApi.create(data)
      requests.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create surat request'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const approveRt = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await suratApi.approveRt(id)
      const index = requests.value.findIndex(r => r.id === id)
      if (index !== -1) {
        requests.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to approve RT request'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const approveRw = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await suratApi.approveRw(id)
      const index = requests.value.findIndex(r => r.id === id)
      if (index !== -1) {
        requests.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to approve RW request'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const approveAdmin = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await suratApi.approveAdmin(id)
      const index = requests.value.findIndex(r => r.id === id)
      if (index !== -1) {
        requests.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to approve admin request'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const rejectRequest = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await suratApi.reject(id)
      const index = requests.value.findIndex(r => r.id === id)
      if (index !== -1) {
        requests.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to reject request'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const pendingRequests = computed(() => requests.value.filter(r => r.status === 'pending'))
  const approvedRequests = computed(() => requests.value.filter(r => r.status.includes('approved')))
  const rejectedRequests = computed(() => requests.value.filter(r => r.status === 'rejected'))

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

  return {
    requests,
    loading,
    error,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    fetchRequests,
    createRequest,
    approveRt,
    approveRw,
    approveAdmin,
    reject: rejectRequest,
    rejectRequest,
    getStatusColor,
  }
}
