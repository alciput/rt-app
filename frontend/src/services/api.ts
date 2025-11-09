import axios from 'axios'
import type { Resident, Announcement, IuranPayment, SuratRequest } from '@/types'

const API_BASE_URL = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || 'mock-jwt-token-u1'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authApi = {
  loginGoogle: (email: string, name: string) =>
    api.post('/auth/login/google', { email, name }),
  loginMicrosoft: (email: string, name: string) =>
    api.post('/auth/login/microsoft', { email, name }),
  logout: () => api.post('/auth/logout'),
}

// Residents API
export const residentsApi = {
  getAll: (params?: { house?: string; status?: string; role?: string }) =>
    api.get<Resident[]>('/residents', { params }),
  getById: (id: string) => api.get<Resident>(`/residents/${id}`),
  create: (data: Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Resident>('/residents', data),
  update: (id: string, data: Partial<Resident>) => {
    console.log('API: Updating resident', id, 'with data:', data)
    return api.put<Resident>(`/residents/${id}`, data)
  },
  delete: (id: string) => api.delete(`/residents/${id}`),
}

// Announcements API
export const announcementsApi = {
  getAll: (params?: { rtId?: string; rwId?: string }) =>
    api.get<Announcement[]>('/announcements', { params }),
  create: (data: { 
    title: string; 
    body: string; 
    content?: string;
    category?: string;
    visibility?: string;
    status?: string;
    publishDate?: string;
    expiryDate?: string;
  }) =>
    api.post<Announcement>('/announcements', data),
  update: (id: string, data: { 
    title?: string; 
    body?: string; 
    content?: string;
    category?: string;
    visibility?: string;
    status?: string;
    publishDate?: string;
    expiryDate?: string;
    archivedAt?: string;
  }) =>
    api.put<Announcement>(`/announcements/${id}`, data),
  delete: (id: string) => api.delete(`/announcements/${id}`),
  // Note: addReaction and addComment methods removed as the backend tables were deleted
  addAttachment: (id: string, data: { 
    fileName: string; 
    fileType: string; 
    fileSize: number; 
    fileData: string; 
  }) => {
    console.log('API: Adding attachment to announcement', id, 'with data:', {
      fileName: data.fileName,
      fileType: data.fileType,
      fileSize: data.fileSize,
      fileDataLength: data.fileData.length
    });
    return api.post(`/announcements/${id}/attachments`, data);
  },
}

// Iuran API
export const iuranApi = {
  getAll: (params?: { month?: string; year?: number; paid?: boolean; residentId?: string }) =>
    api.get<IuranPayment[]>('/iuran', { params }),
  getSummary: (params?: { month?: string; year?: number }) =>
    api.get<{ total: number; paidCount: number; unpaidCount: number; totalCount: number }>('/iuran/summary', { params }),
  create: (data: { residentId: string; month: string; year: number; amount: number }) =>
    api.post<IuranPayment>('/iuran', data),
  update: (id: string, data: { residentId: string; month: string; year: number; amount: number }) =>
    api.put<IuranPayment>(`/iuran/${id}`, data),
  markPaid: (id: string) => api.put<IuranPayment>(`/iuran/${id}/pay`),
  delete: (id: string) => api.delete(`/iuran/${id}`),
  getReports: (params?: { type?: string; year?: number; month?: string; quarter?: string }) =>
    api.get<any>('/iuran/reports', { params }),
  export: (params?: { format?: string; type?: string; year?: number; month?: string; quarter?: string }) =>
    api.get('/iuran/export', { params, responseType: 'blob' }),
}

// Surat API
export const suratApi = {
  getAll: () => api.get<SuratRequest[]>('/surat'),
  create: (data: { type: string; description?: string }) =>
    api.post<SuratRequest>('/surat', data),
  approveRt: (id: string) => api.put<SuratRequest>(`/surat/${id}/approve-rt`),
  approveRw: (id: string) => api.put<SuratRequest>(`/surat/${id}/approve-rw`),
  approveAdmin: (id: string) => api.put<SuratRequest>(`/surat/${id}/approve-admin`),
  reject: (id: string) => api.put<SuratRequest>(`/surat/${id}/reject`),
}

export default api
