import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
    const email = 'yourmeal@eadreamllc.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: {
            email,
            password: hashedPassword,
            name: 'Admin'
        }
    });

    console.log('Password reset successfully for:', user.email);
    console.log('New password is: admin123');
}

resetPassword()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
