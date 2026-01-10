# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)

## Step 1: Supabase Setup (5 minutes)

1. Go to https://supabase.com and create a new project
2. Wait for database initialization (~2 minutes)
3. Get your credentials:
   - **Settings** → **API** → Copy:
     - Project URL
     - anon public key
     - service_role key (⚠️ secret!)
   - **Settings** → **Database** → Copy:
     - Connection string (Session mode)

4. Create Storage buckets:
   - **Storage** → **New Bucket** → Name: `covers` (Public: ✅)
   - **Storage** → **New Bucket** → Name: `uploads` (Public: ❌)

## Step 2: Environment Setup (2 minutes)

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

NEXT_PUBLIC_APP_URL=http://localhost:3000

DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=YourSecurePassword123!
```

**⚠️ Important**: Replace all placeholders with your actual Supabase credentials!

## Step 3: Database Setup (1 minute)

```bash
# Push schema to database
npm run db:push

# Create super admin user
npm run db:seed
```

You should see:
```
✅ Created super admin: admin@example.com
🔑 Password: YourSecurePassword123!
```

## Step 4: Run the Application

```bash
npm run dev
```

Visit:
- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/admin (after login)

## First Login

1. Go to http://localhost:3000/login
2. Email: `admin@example.com`
3. Password: (the one you set in `.env`)

---

## 📁 Project Structure

```
d:/dev/novels/
├── src/app/
│   ├── (auth)/login/         # Login page
│   ├── (public)/             # Public story reader
│   ├── (admin)/admin/        # Admin dashboard
│   └── api/                  # API routes
├── src/components/
│   ├── ui/                   # shadcn/ui components
│   ├── admin/                # Admin components
│   └── reader/               # Reading controls
├── src/lib/
│   ├── supabase/             # Auth clients
│   ├── prisma.ts             # Database
│   ├── permissions.ts        # RBAC
│   └── word-parser.ts        # Word upload
└── prisma/
    ├── schema.prisma         # Database models
    └── seed.ts               # Seed script
```

---

## 🎯 What Works Now

✅ Authentication (login/logout)
✅ Admin dashboard with statistics
✅ Story listing (admin & public)
✅ User management
✅ Word document upload with chapter detection
✅ Reading controls (font size, dark mode)
✅ Role-based permissions

## 🚧 What's Next

See [SETUP.md](file:///d:/dev/novels/SETUP.md) for detailed implementation roadmap:
1. Story detail page
2. Chapter reader page
3. Story create/edit forms
4. Rich text chapter editor
5. Cover image uploads

---

## 🛠️ Useful Commands

```bash
npm run dev              # Start development
npm run build            # Build for production
npm run db:push          # Sync database schema
npm run db:seed          # Create admin user
npm run db:studio        # View database in browser
npm run type-check       # Check TypeScript errors
```

---

## 🐛 Troubleshooting

**"Prisma Client not generated"**
```bash
npx prisma generate
```

**"Authentication failed"**
- Check `.env` file exists
- Verify Supabase credentials
- Restart dev server

**"Database connection error"**
- Check `DATABASE_URL` format
- Make sure Supabase project is active

---

## 📚 Documentation

- **[SETUP.md](file:///d:/dev/novels/SETUP.md)** - Comprehensive setup guide
- **[walkthrough.md](file:///C:/Users/lntdu/.gemini/antigravity/brain/a7f373a8-0743-4d0d-9e76-530f4502970a/walkthrough.md)** - Implementation details
- **[ENV_TEMPLATE.md](file:///d:/dev/novels/ENV_TEMPLATE.md)** - Environment variables template

---

**Ready to go! 🚀**

Login at http://localhost:3000/login and start creating stories!
