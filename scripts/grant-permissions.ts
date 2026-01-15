
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Granting permissions to Supabase roles...');

    try {
        // 1. Grant USAGE on schema public
        await prisma.$executeRawUnsafe(`
      GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
    `);

        // 2. Grant SELECT on all tables
        await prisma.$executeRawUnsafe(`
      GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
    `);

        // 3. Grant ALL on all sequences (for ID generation)
        await prisma.$executeRawUnsafe(`
      GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
    `);

        // 4. (Optional) Force simple RLS policies for now if tables are empty
        // But enabling RLS without policies blocks access.
        // So we will leave RLS disabled (default from Prisma) or ensure policies exist.
        // For now, granting "ALL" permissions implies RLS is bypassed IF RLS is disabled.
        // If RLS is enabled, then policies are needed.
        // Check if RLS is enabled? We assume Prisma tables have RLS disabled by default.

        console.log('Permissions granted successfully!');
    } catch (error) {
        console.error('Error granting permissions:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
