import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '../src/lib/prisma'

async function main() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com'
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'ChangeThisPassword123!'

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Missing Supabase environment variables')
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })

    console.log('🌱 Starting seed...')

    // Check if super admin already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: defaultAdminEmail },
    })

    if (existingUser) {
        console.log('✅ Super admin already exists:', defaultAdminEmail)
        return
    }

    // Create super admin in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: defaultAdminEmail,
        password: defaultAdminPassword,
        email_confirm: true,
    })

    if (authError || !authData.user) {
        throw new Error(`Failed to create auth user: ${authError?.message}`)
    }

    // Create super admin in database
    const superAdmin = await prisma.user.create({
        data: {
            id: authData.user.id,
            email: defaultAdminEmail,
            role: 'SUPER_ADMIN',
        },
    })

    console.log('✅ Created super admin:', superAdmin.email)
    console.log('📧 Email:', defaultAdminEmail)
    console.log('🔑 Password:', defaultAdminPassword)
    console.log('⚠️  Please change the password after first login!')
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
