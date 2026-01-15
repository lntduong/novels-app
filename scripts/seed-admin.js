
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'lntduongit@gmail.com';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || '17120119';

    if (!email || !password) {
        console.error('Missing DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD env vars');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
        create: {
            email,
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    });

    console.log(`Admin user seeded: ${user.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
