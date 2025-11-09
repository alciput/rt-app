import { Resident, Announcement, IuranPayment, SuratRequest, User } from './types/index.js'

// In-memory database for development
export const db = {
  users: [
    { id: 'u1', name: 'Admin User', email: 'admin@rt-rw.com', role: 'Admin' as const },
    { id: 'u2', name: 'Ketua RW', email: 'rw@rt-rw.com', role: 'Ketua RW' as const, rwId: 'rw1' },
    { id: 'u3', name: 'Ketua RT', email: 'rt@rt-rw.com', role: 'Ketua RT' as const, rtId: 'rt1', rwId: 'rw1' },
    { id: 'u4', name: 'Resident', email: 'resident@rt-rw.com', role: 'Resident' as const, rtId: 'rt1', rwId: 'rw1' },
  ] as User[],

  residents: [
    { id: 'r1', name: 'Andi Susanto', house: 'A-01', status: 'active' as const, role: 'Resident' as const, rtId: 'rt1', rwId: 'rw1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'r2', name: 'Budi Hartono', house: 'A-02', status: 'inactive' as const, role: 'Resident' as const, rtId: 'rt1', rwId: 'rw1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'r3', name: 'Citra Dewi', house: 'B-01', status: 'active' as const, role: 'Ketua RT' as const, rtId: 'rt1', rwId: 'rw1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  ] as Resident[],

  announcements: [
    { id: 'a1', title: 'Gotong Royong Minggu', body: 'Dimulai jam 07:00.', authorId: 'u3', rtId: 'rt1', rwId: 'rw1', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
    { id: 'a2', title: 'Pembayaran Iuran', body: 'Batas pembayaran tanggal 10 setiap bulan.', authorId: 'u2', rwId: 'rw1', createdAt: '2024-01-10', updatedAt: '2024-01-10' },
  ] as Announcement[],

  iuranPayments: [
    { id: 'p1', residentId: 'r1', month: '10', year: 2024, amount: 100000, paid: true, paidAt: '2024-10-05', createdAt: '2024-10-01' },
    { id: 'p2', residentId: 'r2', month: '10', year: 2024, amount: 100000, paid: false, createdAt: '2024-10-01' },
  ] as IuranPayment[],

  suratRequests: [
    { id: 's1', residentId: 'r1', type: 'Domicile Letter', status: 'pending' as const, description: 'For school registration', createdAt: '2024-01-20' },
    { id: 's2', residentId: 'r2', type: 'Permission Letter', status: 'rt-approved' as const, description: 'For business permit', rtApprovedAt: '2024-01-21', createdAt: '2024-01-20' },
  ] as SuratRequest[],
}

// Helper functions
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString()
}
