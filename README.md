# RT/RW Management Application (MVP Scaffold)

A web and mobile-friendly RT/RW management app scaffold.

- Frontend: Vue 3 + TypeScript + TailwindCSS (Vite)
- Backend: Node.js + Express + SQLite (mock-first)
- Auth: Google/Microsoft placeholders, RBAC guard ready

## Quick start

### 1) Frontend
```bash
cd "frontend"
npm install
npm run dev
```

### 2) Backend
```bash
cd "backend"
npm install
npm run dev
```

### Environment
- Frontend dev server: http://localhost:5173
- Backend API: http://localhost:3000/api

## Features (MVP scope)
- Resident CRUD, digital ID (placeholder)
- Announcements with optional media
- Iuran contributions, simple reports
- Surat request workflow (Resident → Ketua RT → Ketua RW → Admin)
- Role-Based Access Control: Resident, Ketua RT, Ketua RW, Admin

## Project structure
```
/ frontend
  /src
    /components/admin
    /composables
    /pages
    /router
    /services
    /types
/ backend
  /src
    /routes
    db.ts
    rbac.ts
/ context
  /components
```

## Database
- **SQLite** database with automatic table creation and seeding
- Database file: `backend/database.sqlite` (created automatically)
- Tables: users, residents, announcements, iuran_payments, surat_requests
- Initial data seeded on first run

## Scripts
- Frontend: `dev`, `build`, `preview`, `typecheck`
- Backend: `dev` (tsx), `build` (tsc), `start` (node dist)

## Auth placeholders
- Hooks (`useAuth`) and route guards ready for Google/Microsoft login integration.

## Development Status
✅ Project structure initialized
✅ Frontend Vue 3 + TypeScript + Tailwind scaffolded
✅ Backend Express + TypeScript + RBAC implemented
✅ SQLite database with tables and seeding
✅ Modular admin components created
✅ API integration layer added
✅ Component documentation provided

## Next Steps
1. Install dependencies: `cd frontend && npm install` and `cd backend && npm install`
2. Start development servers: `npm run dev` in both directories
3. Replace mock authentication with real Google/Microsoft OAuth
4. Implement SQLite database with proper migrations
5. Add data validation and error handling
6. Implement file upload for announcements
7. Add PDF generation for reports
8. Deploy to production

## License
MIT
