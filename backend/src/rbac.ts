import { Request, Response, NextFunction } from 'express'
import { Role } from './types/index.js'

// Mock JWT verification - replace with real JWT verification
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  // Mock user extraction from token - replace with real JWT decode
  // Map frontend roles to backend roles for surat functionality
  const mockUser = { 
    id: 'u1', 
    name: 'Owner User', 
    role: 'Owner' as Role, 
    rtId: '01', 
    rwId: '11',
    // Add backend role mapping for surat routes
    backendRole: 'Admin' as 'Admin' | 'Ketua RT' | 'Ketua RW' | 'Resident'
  }
  req.user = mockUser
  next()
}

export function requireRole(roles: (Role | 'Admin' | 'Ketua RT' | 'Ketua RW' | 'Resident')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Check both frontend role and backend role
    const userRole = req.user.role
    const userBackendRole = (req.user as any).backendRole
    
    const hasPermission = roles.includes(userRole) || roles.includes(userBackendRole)
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        name: string
        role: Role
        rtId?: string
        rwId?: string
        backendRole?: 'Admin' | 'Ketua RT' | 'Ketua RW' | 'Resident'
      }
    }
  }
}
