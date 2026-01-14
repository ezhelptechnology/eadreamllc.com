import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create initial admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'yourmeal@eadreamllc.com' },
        update: {},
        create: {
            email: 'yourmeal@eadreamllc.com',
            password: hashedPassword,
            name: 'Admin',
        },
    });

    console.log('Created admin user:', admin.email);
    console.log('Default password: admin123');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
