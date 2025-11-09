import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import path from 'path'

const dbPath = path.join(process.cwd(), 'database.sqlite')
const db = new sqlite3.Database(dbPath)

// Promisify database methods
const dbRun = promisify(db.run.bind(db))
const dbGet = promisify(db.get.bind(db))
const dbAll = promisify(db.all.bind(db))

// Wrapper functions that support parameters
export const dbRunWithParams = (sql: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err)
      else resolve({ changes: this.changes, lastID: this.lastID })
    })
  })
}

export const dbGetWithParams = (sql: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

export const dbAllWithParams = (sql: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

export { db, dbRun, dbGet, dbAll }

// Initialize database tables
export async function initDatabase() {
  try {
    // Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('Contract', 'Owner')),
        rtId TEXT,
        rwId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Residents table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS residents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        house TEXT NOT NULL,
        cluster TEXT NOT NULL CHECK(cluster IN ('Alium', 'Boulevard')),
        blok TEXT,
        nikKtp TEXT,
        ktpFile TEXT,
        status TEXT NOT NULL CHECK(status IN ('active', 'inactive')),
        role TEXT NOT NULL CHECK(role IN ('Contract', 'Owner')),
        rtId TEXT NOT NULL,
        rwId TEXT NOT NULL,
        familyId TEXT,
        relationship TEXT,
        age INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)


    try {
      await dbRun(`ALTER TABLE residents ADD COLUMN cluster TEXT`)
    } catch (error) {
      // Column already exists, ignore error
    }

    try {
      await dbRun(`ALTER TABLE residents ADD COLUMN blok TEXT`)
    } catch (error) {
      // Column already exists, ignore error
    }

    try {
      await dbRun(`ALTER TABLE residents ADD COLUMN nikKtp TEXT`)
    } catch (error) {
      // Column already exists, ignore error
    }

    try {
      await dbRun(`ALTER TABLE residents ADD COLUMN ktpFile TEXT`)
    } catch (error) {
      // Column already exists, ignore error
    }

    // Announcements table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS announcements (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        authorId TEXT NOT NULL,
        rtId TEXT,
        rwId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (authorId) REFERENCES users(id)
      )
    `)

    // Add new columns to announcements table for enhanced features
    try {
      await dbRun(`ALTER TABLE announcements ADD COLUMN content TEXT`)
    } catch (error) {
      // Column already exists, ignore error
    }

    try {
      await dbRun(`ALTER TABLE announcements ADD COLUMN attachments TEXT`)
    } catch (error) {
      // Column already exists, ignore error
    }

    try {
      await dbRun(`ALTER TABLE announcements ADD COLUMN visibility TEXT DEFAULT 'rt'`)
    } catch (error) {
      // Column already exists, ignore error
    }

    try {
      await dbRun(`ALTER TABLE announcements ADD COLUMN category TEXT DEFAULT 'general'`)
    } catch (error) {
      // Column already exists, ignore error
    }

    try {
      await dbRun(`ALTER TABLE announcements ADD COLUMN status TEXT DEFAULT 'draft'`)
    } catch (error) {
      // Column already exists, ignore error
    }

    try {
      await dbRun(`ALTER TABLE announcements ADD COLUMN publishDate DATETIME`)
    } catch (error) {
      // Column already exists, ignore error
    }

    try {
      await dbRun(`ALTER TABLE announcements ADD COLUMN expiryDate DATETIME`)
    } catch (error) {
      // Column already exists, ignore error
    }

    try {
      await dbRun(`ALTER TABLE announcements ADD COLUMN archivedAt DATETIME`)
    } catch (error) {
      // Column already exists, ignore error
    }

    // Create announcement attachments table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS announcement_attachments (
        id TEXT PRIMARY KEY,
        announcementId TEXT NOT NULL,
        fileName TEXT NOT NULL,
        fileType TEXT NOT NULL,
        fileSize INTEGER NOT NULL,
        fileData TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (announcementId) REFERENCES announcements(id) ON DELETE CASCADE
      )
    `)

    // Note: announcement_reactions and announcement_comments tables removed
    // as they were not being used in the current implementation

    // Iuran payments table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS iuran_payments (
        id TEXT PRIMARY KEY,
        residentId TEXT NOT NULL,
        month TEXT NOT NULL,
        year INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        paid BOOLEAN DEFAULT 0,
        paidAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (residentId) REFERENCES residents(id)
      )
    `)

    // Surat requests table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS surat_requests (
        id TEXT PRIMARY KEY,
        residentId TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('pending', 'rt-approved', 'rw-approved', 'admin-approved', 'rejected')),
        description TEXT,
        rtApprovedAt DATETIME,
        rwApprovedAt DATETIME,
        adminApprovedAt DATETIME,
        rejectedAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (residentId) REFERENCES residents(id)
      )
    `)

    // Note: Migration code removed as it's no longer needed
    // The residents table schema is now stable

    console.log('✅ Database tables initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    throw error
  }
}

// Seed database with initial data
export async function seedDatabase() {
  try {
    // Check if data already exists
    const userCount = await dbGet('SELECT COUNT(*) as count FROM users')
    if (userCount.count > 0) {
      console.log('📊 Database already seeded')
      return
    }

    // Insert initial users
    await dbRun(`
      INSERT INTO users (id, name, email, role, rtId, rwId) VALUES 
      ('u1', 'Admin User', 'admin@rt-rw.com', 'Admin', NULL, NULL),
      ('u2', 'Ketua RW', 'rw@rt-rw.com', 'Ketua RW', NULL, 'rw1'),
      ('u3', 'Ketua RT', 'rt@rt-rw.com', 'Ketua RT', 'rt1', 'rw1'),
      ('u4', 'Resident', 'resident@rt-rw.com', 'Resident', 'rt1', 'rw1')
    `)

    // Insert initial residents
    await dbRun(`
      INSERT INTO residents (id, name, house, status, role, rtId, rwId) VALUES 
      ('r1', 'Andi Susanto', 'A-01', 'active', 'Resident', 'rt1', 'rw1'),
      ('r2', 'Budi Hartono', 'A-02', 'inactive', 'Resident', 'rt1', 'rw1'),
      ('r3', 'Citra Dewi', 'B-01', 'active', 'Ketua RT', 'rt1', 'rw1')
    `)

    // Insert initial announcements
    await dbRun(`
      INSERT INTO announcements (id, title, body, authorId, rtId, rwId) VALUES 
      ('a1', 'Gotong Royong Minggu', 'Dimulai jam 07:00.', 'u3', 'rt1', 'rw1'),
      ('a2', 'Pembayaran Iuran', 'Batas pembayaran tanggal 10 setiap bulan.', 'u2', NULL, 'rw1')
    `)

    // Insert initial iuran payments
    await dbRun(`
      INSERT INTO iuran_payments (id, residentId, month, year, amount, paid, paidAt) VALUES 
      ('p1', 'r1', '10', 2024, 100000, 1, '2024-10-05 10:00:00'),
      ('p2', 'r2', '10', 2024, 100000, 0, NULL)
    `)

    // Insert initial surat requests
    await dbRun(`
      INSERT INTO surat_requests (id, residentId, type, status, description, rtApprovedAt) VALUES 
      ('s1', 'r1', 'Domicile Letter', 'pending', 'For school registration', NULL),
      ('s2', 'r2', 'Permission Letter', 'rt-approved', 'For business permit', '2024-01-21 14:30:00')
    `)

    console.log('🌱 Database seeded with initial data')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}
