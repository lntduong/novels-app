# Novels App 📚

> A modern, feature-rich web application for reading and managing novels, built with performance and user experience in mind.

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)

## 📖 Introduction

**Novels App** is a comprehensive reading platform designed to bridge the gap between authors and readers. It offers a seamless reading experience with customizable settings, while providing powerful tools for content creators to manage their stories and chapters.

Whether you're a reader looking for your next favorite story or an admin managing a growing library of content, Novels App provides a fast, accessible, and secure environment.

## ✨ Key Features

### For Readers 📖
- **Immersive Reading Experience**: Customizable font sizes, font families, and line spacing.
- **Theme Support**: Built-in Dark/Light mode switcher for comfortable reading day or night.
- **Engagement**: Rate chapters and leave anonymous or authenticated comments.
- **Privacy & Security**: Content protection system prevents unauthorized copying (anti-copy, right-click, dev-tools).
- **Localization**: Full support for English and Vietnamese (Tiếng Việt) languages.

### For Admins & Creators ✍️
- **Dashboard**: Comprehensive overview of stats (Stories, Chapters, Users).
- **Content Management**: Create, edit, publish, or archive stories and chapters intuitively.
- **Rich Text Editor**: Integrated editor for writing and formatting chapter content.
- **User Management**: Role-based access control (Super Admin, Admin, Editor, Viewer).
- **File Support**: Import content directly from Word documents.

## 🏗️ Overall Architecture

The application is built on a modern stack using the **Next.js App Router** for server-side rendering and static site generation, ensuring optimal performance and SEO.

```mermaid
graph TD
    Client[Client Browser] --> LB[Load Balancer / Vercel Edge]
    LB --> Next[Next.js Server (App Router)]
    Next --> Auth[Auth Layer (Custom/Supabase)]
    Next --> DB[(PostgreSQL Database)]
    Next --> Storage[File Storage (Images)]
    
    subgraph "Application Core"
    Next
    end
    
    subgraph "Data Layer"
    DB
    Storage
    end
```

### Database Schema
The core entities and their relationships managed via Prisma ORM:

```mermaid
erDiagram
    User ||--o{ Story : writes
    User ||--o{ ChapterRating : rates
    User ||--o{ ChapterComment : comments
    Story ||--o{ Chapter : contains
    Story }|..|{ User : author
    Chapter ||--o{ ChapterRating : has
    Chapter ||--o{ ChapterComment : has

    User {
        string id
        string email
        enum role "SUPER_ADMIN, ADMIN, EDITOR, VIEW"
    }

    Story {
        string id
        string title
        string slug
        enum status "DRAFT, PUBLISHED"
    }

    Chapter {
        string id
        string title
        string content
        boolean isLocked
    }
```

## 🛠️ Installation

Follow these steps to set up the project locally.

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Supabase project)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/novels-app.git
   cd novels-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory. See [Env Configuration](#-env-configuration) for details.

4. **Initialize Database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Push schema to database
   npx prisma db push
   
   # (Optional) Seed initial data
   npm run db:seed
   ```

## 🚀 Running the Project

**Development Mode**
Starts the development server on `http://localhost:3000` with hot-reload.
```bash
npm run dev
```

**Production Build**
Builds the application for production usage.
```bash
npm run build
npm start
```

## ⚙️ Env Configuration

Create a `.env` file based on the template below. **Do not commit your actual secrets.**

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Checksum connection string for Prisma | `postgres://user:pass@host:5432/db` |
| `DIRECT_URL` | Direct connection string for migrations | `postgres://user:pass@host:5432/db?pgbouncer=true` |
| `NEXT_PUBLIC_APP_URL` | Base URL of your application | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for signing auth tokens | `super-secret-key` |
| `NEXTAUTH_URL` | Canonical URL for NextAuth | `http://localhost:3000` |

## 📂 Folder Structure

The project follows the standard Next.js App Router structure:

```
src/
├── app/                 # App Router pages and layouts
│   ├── (admin)/        # Admin protected routes
│   ├── (auth)/         # Authentication routes
│   ├── (public)/       # Public facing routes (Reader)
│   ├── api/            # API Route Handlers
│   └── layout.tsx      # Root layout
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── public/         # Reader-facing components
│   ├── providers/      # Context providers (Theme, Auth, Content)
│   └── ui/             # Shadcn/UI primitive components
├── lib/                 # Utility functions and libraries (Prisma, Utils)
├── locales/             # i18n localization files
└── types/               # TypeScript type definitions
```

## 🤝 Contribution Guidelines

We welcome contributions! Please follow these steps:

1.  **Fork** the project.
2.  **Create** your feature branch (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  **Open** a Pull Request.

Please ensure your code follows the existing style and linting rules:
```bash
npm run lint
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🗺️ Roadmap

- [x] Basic Story & Chapter Management
- [x] Public Reader Interface with Customization
- [x] Dark Mode Support
- [x] Content Copy Protection
- [ ] User Bookmarks & Reading History
- [ ] Advanced Search with Filters
- [ ] Author Payment System
- [ ] Mobile App (React Native)

---

Built with ❤️ by the Novels App Team.
