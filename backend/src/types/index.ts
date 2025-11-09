export type Role = 'Contract' | 'Owner'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  rtId?: string
  rwId?: string
}

export interface Resident {
  id: string
  name: string
  house: string
  status: 'active' | 'inactive'
  role: Role
  rtId: string
  rwId: string
  createdAt: string
  updatedAt: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  content?: string // Rich text/markdown content
  authorId: string
  rtId?: string
  rwId?: string
  visibility: 'rt' | 'rw' | 'global'
  category: 'general' | 'rt' | 'rw' | 'event' | 'urgent' | 'maintenance'
  status: 'draft' | 'published' | 'archived'
  publishDate?: string
  expiryDate?: string
  archivedAt?: string
  attachments?: AnnouncementAttachment[]
  reactions?: AnnouncementReaction[]
  comments?: AnnouncementComment[]
  createdAt: string
  updatedAt: string
}

export interface AnnouncementAttachment {
  id: string
  announcementId: string
  fileName: string
  fileType: string
  fileSize: number
  fileData: string
  createdAt: string
}

export interface AnnouncementReaction {
  id: string
  announcementId: string
  residentId: string
  reactionType: 'like' | 'love' | 'check' | 'thumbs_up' | 'heart'
  createdAt: string
}

export interface AnnouncementComment {
  id: string
  announcementId: string
  residentId: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface IuranPayment {
  id: string
  residentId: string
  month: string
  year: number
  amount: number
  paid: boolean
  paidAt?: string
  createdAt: string
}

export type SuratStatus = 'pending' | 'rt-approved' | 'rw-approved' | 'admin-approved' | 'rejected'

export interface SuratRequest {
  id: string
  residentId: string
  type: string
  status: SuratStatus
  description?: string
  rtApprovedAt?: string
  rwApprovedAt?: string
  adminApprovedAt?: string
  rejectedAt?: string
  createdAt: string
}
