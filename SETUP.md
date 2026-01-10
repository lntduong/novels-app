# 📚 Web Novel Platform - Setup Guide

## Overview

This is a Next.js-based web novel reading platform with:
- **Public Access**: Readers can browse and read stories without login
- **Admin Dashboard**: Role-based content management (SUPER_ADMIN, ADMIN, EDITOR, VIEWER)
- **Word Upload**: Import .docx files with automatic chapter detection
- **Modern UI**: Dark mode support and adjustable reading preferences
- **Supabase Backend**: Authentication, database, and file storage

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth + PostgreSQL), Prisma ORM
- **Rich Editor**: TipTap (for chapter editing)
- **Word Parsing**: Mammoth.js (for .docx conversion)
- **Deployment**: Vercel

---

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+** installed
2. **Supabase Account** (free tier)
3. **Git** (optional)

### Step 1: Supabase Setup

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the database to initialize (~2 minutes)
3. Navigate to **Project Settings** → **API**
4. Copy the following values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key →  `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

5. Navigate to **Project Settings** → **Database**
6. Scroll to **Connection String** → **Session mode**
7. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password
8. This is your `DATABASE_URL`

### Step 2: Environment Configuration

1. Create a `.env` file in the project root (copy from `ENV_TEMPLATE.md`):

```bash
# .env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

NEXT_PUBLIC_APP_URL=http://localhost:3000

# Default Super Admin Credentials
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=YourSecurePassword123!
```

**⚠️ IMPORTANT**: Change the `DEFAULT_ADMIN_PASSWORD` to something secure!

### Step 3: Database Migration

Run the following commands to set up your database:

```bash
# Generate Prisma client
npm run db:push

# Seed the super admin user
npm run db:seed
```

You should see output like:
```
✅ Created super admin: admin@example.com
📧 Email: admin@example.com
🔑 Password: YourSecurePassword123!
⚠️  Please change the password after first login!
```

### Step 4: Supabase Storage Setup

1. In Supabase Dashboard, go to **Storage**
2. Create two buckets:
   - **`covers`** (Public bucket)
     - Click "New Bucket"
     - Name: `covers`
     - Public: ✅ Enabled
     - Click "Create"
   
   - **`uploads`** (Private bucket)
     - Click "New Bucket"
     - Name: `uploads`
     - Public: ❌ Disabled
     - Click "Create"

### Step 5: Run Development Server

```bash
npm run dev
```

Visit:
- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Admin Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔐 First Login

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Login with:
   - **Email**: `admin@example.com` (or your custom email from `.env`)
   - **Password**: The password you set in `.env`

3. **Change your password immediately**:
   - This functionality can be added later via Supabase Auth UI
   - For now, you can change it directly in Supabase Dashboard → Authentication → Users

---

## 📋 User Roles

| Role | Permissions |
|------|-------------|
| **SUPER_ADMIN** | Full access to everything |
| **ADMIN** | Manage users (except SUPER_ADMIN), manage all content, publish stories |
| **EDITOR** | Create/edit/delete stories and chapters |
| **VIEWER** | Read-only access to admin dashboard |

---

## 🎨 Features Implemented

### ✅ Completed

- [x] Next.js 14 project with TypeScript and Tailwind CSS
- [x] Supabase authentication integration
- [x] Prisma ORM setup with User, Story, Chapter models
- [x] Role-based access control (RBAC)
- [x] Admin dashboard with statistics
- [x] Story management interface
- [x] Public story listing page
- [x] Reading controls (font size, dark mode)
- [x] Middleware for route protection
- [x] Database seed script

### 🚧 To Be Implemented

The following features are designed but need implementation:

1. **Word Upload Feature**
   - Upload .docx files
   - Auto-detect chapters
   - Preview and edit before saving

2. **Chapter Management**
   - Create/edit chapters manually
   - Rich text editor (TipTap)
   - Chapter reordering

3. **Story Detail Page**
   - View story with chapter list
   - SEO optimization

4. **Chapter Reader**
   - Clean reading interface
   - Chapter navigation (prev/next)
   - Apply reading preferences

5. **User Management**
   - Manage admin users
   - Assign roles

---

## 📁 Project Structure

```
d:/dev/novels/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/         # Login page
│   │   ├── (public)/          # Public pages (no auth)
│   │   │   ├── page.tsx       # Homepage (story list)
│   │   │   └── layout.tsx
│   │   ├── (admin)/           # Admin pages (protected)
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx   # Dashboard
│   │   │   │   ├── stories/   # Story management
│   │   │   │   └── users/     # User management
│   │   │   └── layout.tsx     # Admin navigation
│   │   └── api/
│   │       └── auth/          # Auth endpoints
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── admin/             # Admin components
│   │   └── reader/            # Reader components
│   ├── lib/
│   │   ├── supabase/          # Supabase clients
│   │   ├── prisma.ts          # Prisma client
│   │   ├── permissions.ts     # RBAC utilities
│   │   └── word-parser.ts     # Word file parser
│   └── types/                 # TypeScript types
├── .env                       # Environment variables (create this!)
├── ENV_TEMPLATE.md            # Environment template
├── package.json
└── README.md
```

---

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push Prisma schema to database
npm run db:migrate       # Create new migration
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Type checking
npm run type-check       # Check TypeScript errors
```

---

## 🚀 Deployment to Vercel

1. Push code to GitHub repository
2. Go to [https://vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Configure environment variables:
   - Add all variables from your `.env` file
   - Update `NEXT_PUBLIC_APP_URL` to your production URL
5. Deploy!

After deployment:
```bash
# Run database migrations in production
npx prisma migrate deploy
```

---

## 🎯 Next Steps

1. **Implement Word Upload**:
   - Create upload API route
   - Build Word upload component
   - Integrate Mammoth.js parser

2. **Add Chapter Editor**:
   - Integrate TipTap rich text editor
   - Create chapter CRUD API routes
   - Build chapter management UI

3. **Complete Public Pages**:
   - Story detail page with chapters
   - Chapter reader with navigation
   - SEO optimization

4. **User Management**:
   - User list page
   - Role assignment
   - Create/delete users

5. **Polish**:
   - Error handling
   - Loading states
   - Better mobile responsiveness
   - Password change functionality

---

## 💡 Tips

- **Free Tier Limits** (Supabase):
  - Database: 500 MB
  - Storage: 1 GB
  - Keep content optimized!

- **Security**:
  - Never commit `.env` file
  - Keep `SUPABASE_SERVICE_ROLE_KEY` secret
  - Use Row Level Security (RLS) policies in production

- **Performance**:
  - Use static generation for public pages
  - Optimize images with Next.js Image component
  - Consider pagination for large story lists

---

## 🐛 Troubleshooting

### "Prisma Client is not generated"
```bash
npx prisma generate
```

### "DATABASE_URL environment variable not found"
- Make sure `.env` file exists
- Check the connection string format
- Restart the dev server

### "Authentication error"
- Verify Supabase credentials in `.env`
- Check if seed script ran successfully
- Try logging in with Chrome DevTools open to see errors

### "Permission denied" errors
- Check user role in database
- Verify middleware is running
- Check admin layout authentication logic

---

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify all environment variables are set correctly
4. Make sure Supabase project is active

---

**Happy writing! 📖✨**
