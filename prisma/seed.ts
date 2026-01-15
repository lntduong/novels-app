import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma'

async function main() {
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com'
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'ChangeThisPassword123!'

    console.log('🌱 Starting seed...')

    // Check if super admin already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: defaultAdminEmail },
    })

    if (existingUser) {
        console.log('✅ Super admin already exists:', defaultAdminEmail)
    } else {
        // Hash password
        const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10)

        // Create super admin in database
        const superAdmin = await prisma.user.create({
            data: {
                email: defaultAdminEmail,
                password: hashedPassword, // Store hashed password
                role: 'SUPER_ADMIN',
            },
        })

        console.log('✅ Created super admin:', superAdmin.email)
        console.log('📧 Email:', defaultAdminEmail)
        console.log('🔑 Password:', defaultAdminPassword)
        console.log('⚠️  Please change the password after first login!')
    }

    // Seed Genres (Runs regardless of user status)
    const genres = [
        { name: 'Tiên Hiệp', slug: 'tien-hiep' },
        { name: 'Kiếm Hiệp', slug: 'kiem-hiep' },
        { name: 'Ngôn Tình', slug: 'ngon-tinh' },
        { name: 'Đô Thị', slug: 'do-thi' },
        { name: 'Huyền Huyễn', slug: 'huyen-huyen' },
        { name: 'Khoa Huyễn', slug: 'khoa-huyen' },
        { name: 'Võng Du', slug: 'vong-du' },
        { name: 'Đồng Nhân', slug: 'dong-nhan' },
        { name: 'Trinh Thám', slug: 'trinh-tham' },
        { name: 'Kinh Dị', slug: 'kinh-di' },
        { name: 'Lịch Sử', slug: 'lich-su' },
        { name: 'Quân Sự', slug: 'quan-su' },
        { name: 'Hệ Thống', slug: 'he-thong' },
        { name: 'Xuyên Không', slug: 'xuyen-khong' },
        { name: 'Trọng Sinh', slug: 'trong-sinh' },
        { name: 'Điền Văn', slug: 'dien-van' },
        { name: 'Cổ Đại', slug: 'co-dai' },
        { name: 'Mạt Thế', slug: 'mat-the' },
        { name: 'Hài Hước', slug: 'hai-huoc' },
        { name: 'Ngược', slug: 'nguoc' },
        { name: 'Sủng', slug: 'sung' },
        { name: 'Cung Đấu', slug: 'cung-dau' },
        { name: 'Nữ Cường', slug: 'nu-cuong' },
        { name: 'Đam Mỹ', slug: 'dam-my' },
        { name: 'Bách Hợp', slug: 'bach-hop' },
    ]

    console.log('🌱 Seeding genres...')
    for (const genre of genres) {
        await prisma.genre.upsert({
            where: { slug: genre.slug },
            update: {},
            create: genre,
        })
    }
    console.log(`✅ Seeded ${genres.length} genres`)
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
