# Novels App 📚

> **A self-hosted, feature-rich web platform for reading and creating novels.**  
> Built for performance, privacy, and complete data sovereignty.

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=flat-square&logo=prisma)
![Docker](https://img.shields.io/badge/Docker-Community-2496ED?style=flat-square&logo=docker)

---

## 📖 Introduction

**Novels App** is a modern reading platform engineered to bridge the gap between authors and readers. Unlike traditional platforms, it is designed for **complete self-hosting**, giving you full control over your data, users, and content.

Whether you are deploying a personal library on your NAS or building a community reading site, Novels App provides a robust, secure, and beautiful environment out of the box.

---

## ✨ Key Features

### 🌟 For Readers
*   **Immersive Reading**: Distraction-free reader with customizable fonts, sizing, and line height.
*   **Smart Library**: Automatic bookmarking and reading history tracking.
*   **Discovery**: Advanced search with genre filtering and popularity sorting.
*   **Interactivity**: Rate chapters, leave comments, and track view counts.
*   **Accessibility**: Native dark/light mode support and responsive mobile design.

### 🛡️ For Admins & Creators
*   **Full Data Sovereignty**: Self-hosted Auth (NextAuth), Database (Postgres), and Storage (MinIO).
*   **Content Protection**: Built-in anti-copy and right-click protection mechanisms.
*   **Role-Based Access**: Granular permissions (Viewer, Editor, Admin, Super Admin).
*   **Rich Editor**: WYSIWYG editor for drafting and publishing chapters.
*   **One-Click Deploy**: Automated PowerShell scripts for seamless NAS deployment.

---

## 🏗️ Overall Architecture

The application follows a **Microservices-ready Monolith** architecture, containerized for easy deployment.

```mermaid
graph TD
    User((User)) -->|HTTPS| CF[Cloudflare Tunnel]
    
    subgraph "Synology NAS / Server"
        CF -->|Reverse Proxy| Web[Next.js App Container]
        
        Web -->|Query| DB[(PostgreSQL)]
        Web -->|Auth/Session| Web
        Web -->|Upload/Stream| MinIO[MinIO Storage]
        
        subgraph "Data Persistence"
            DB
            MinIO
        end
    end
```

### Tech Stack
*   **Frontend**: Next.js 14 (App Router), Tailwind CSS, Shadcn UI.
*   **Backend**: Next.js Server Actions, NextAuth.js (v5).
*   **Database**: PostgreSQL (via Prisma ORM).
*   **Storage**: MinIO (S3 Compatible Object Storage).
*   **Infrastructure**: Docker Compose, Cloudflare Tunnel.

---

## 🛠️ Installation

### Prerequisites
*   **Node.js**: v18.17+ (for local development)
*   **Docker & Docker Compose**: (for production deployment)
*   **PostgreSQL**: (Local or Containerized)

### 1. Local Development Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/novels-app.git
cd novels-app
npm install
```

Set up your environment variables (see [Configuration](#-env-configuration)) and initialize the database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to local DB
npx prisma db push

# Seed initial data (Admin user, etc.)
npm run db:seed
```

Start the development server:
```bash
npm run dev
```
Visit `http://localhost:3000` to see your app.

### 2. Production Deployment (NAS/Server)

We provide automated scripts for deploying to a Synology NAS or any SSH-enabled Linux server.

1.  **Configure `.env`**: Ensure your production secrets are set.
2.  **Setup SSH**: Run `./scripts/setup-ssh.ps1` to enable passwordless deployment.
3.  **Deploy**: Run `./scripts/deploy.ps1`.

> For detailed deployment instructions, please refer to [README_DOCKER.md](./README_DOCKER.md).

---

## ⚙️ Env Configuration

Create a `.env` file in the root directory.

**Core Application**
```bash
NEXT_PUBLIC_APP_URL="https://novels.yourdomain.com"
NODE_ENV="production"
```

**Database**
```bash
# Connects to the Postgres container
DATABASE_URL="postgresql://user:password@host:5432/novels_db"
```

**Authentication (NextAuth.js)**
```bash
AUTH_SECRET="your-super-secret-random-string"
AUTH_TRUST_HOST="true" # Required for Docker/Reverse Proxy
DEFAULT_ADMIN_EMAIL="admin@example.com"
DEFAULT_ADMIN_PASSWORD="securepassword"
```

**File Storage (MinIO)**
```bash
MINIO_ENDPOINT="http://minio:9000"
MINIO_PUBLIC_ENDPOINT="https://storage.yourdomain.com"
MINIO_ROOT_USER="admin"
MINIO_ROOT_PASSWORD="storage-password"
MINIO_BUCKET="covers"
MINIO_REGION="us-east-1"
```

---

## 📂 Folder Structure

```
├── 📁 scripts/           # Deployment & Automation scripts
├── 📁 prisma/            # Database schema & seeds
├── 📁 public/            # Static assets
├── 📂 src/
│   ├── 📂 app/           # Next.js App Router (Pages & API)
│   │   ├── (admin)/      # Protected Admin Routes
│   │   ├── (auth)/       # Login/Register Routes
│   │   └── (public)/     # Reader Routes
│   ├── 📂 components/    # React Components
│   │   ├── admin/        # Admin-specific logic
│   │   └── ui/           # Shadcn/Radix UI primitives
│   ├── 📂 lib/           # Utilities (Auth, DB, S3)
│   └── 📂 locales/       # i18n Translation Files
└── 📄 Dockerfile         # Production image definition
```

---

## 🤝 Contribution Guidelines

We welcome contributions from the community!

1.  **Fork** the project.
2.  **Create** your feature branch (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add: AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  **Open** a Pull Request.

Please make sure to run `npm run lint` before committing.

---

## 🗺️ Roadmap

- [x] **Core Platform**: Reading, Writing, and User System.
- [x] **Self-Hosting**: Full Docker support with MinIO & NextAuth.
- [x] **Localization**: English & Vietnamese support.
- [ ] **Advanced Analytics**: Detailed readership stats for authors.
- [ ] **Mobile App**: Native companion app using React Native.
- [ ] **Monetization**: Unlockable chapters and subscription models.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by the Novels App Team.
</p>
