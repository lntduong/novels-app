import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

async function fixSuperAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'lastdongh@gmail.com'

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    try {
        // Get user from Supabase Auth
        const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()

        if (listError) {
            console.error('❌ Error listing users:', listError)
            return
        }

        const authUser = authUsers.users.find(u => u.email === defaultAdminEmail)

        if (!authUser) {
            console.log('❌ No auth user found with email:', defaultAdminEmail)
            console.log('Please create user in Supabase Auth first')
            return
        }

        console.log('✅ Found auth user:', authUser.email, 'ID:', authUser.id)

        // Check if user exists in database
        const dbUser = await prisma.user.findUnique({
            where: { id: authUser.id }
        })

        if (dbUser) {
            console.log('✅ User already exists in database')
            return
        }

        // Create user in database
        const newUser = await prisma.user.create({
            data: {
                id: authUser.id,
                email: authUser.email!,
                role: 'SUPER_ADMIN'
            }
        })

        console.log('✅ Created SUPER_ADMIN user in database:', newUser.email)
        console.log('🎉 You can now login with:', defaultAdminEmail)

    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

fixSuperAdmin()
