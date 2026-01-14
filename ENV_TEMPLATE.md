# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
# 1. DATABASE_URL: Use Port 6543 (Transaction Mode) for connection pooling
# Ensure you add ?pgbouncer=true&connection_limit=1 at the end for Prisma/Serverless
DATABASE_URL="postgres://[user]:[password]@[aws-region].pooler.supabase.com:6543/[db-name]?pgbouncer=true&connection_limit=1"

# 2. DIRECT_URL: Use Port 5432 (Session Mode) for migrations
DIRECT_URL="postgres://[user]:[password]@[aws-region].pooler.supabase.com:5432/[db-name]"

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Default Super Admin (used for seeding)
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=change_this_password
