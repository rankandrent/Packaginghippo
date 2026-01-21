const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

async function createFirstAdmin() {
    try {
        console.log('Creating first admin user...\n');

        const email = 'admin@test.com';
        const password = 'Test123!@#';
        const name = 'Admin User';

        // Check if admin already exists
        const existing = await prisma.adminUser.findUnique({
            where: { email },
        });

        if (existing) {
            console.log(' Admin user already exists!');
            console.log('Email:', existing.email);
            console.log('Is Approved:', existing.isApproved);

            // Update to approved if not approved
            if (!existing.isApproved) {
                await prisma.adminUser.update({
                    where: { id: existing.id },
                    data: { isApproved: true },
                });
                console.log('\n✅ Admin user has been APPROVED!');
            } else {
                console.log('\n✅ Admin is already approved and ready to use!');
            }

            console.log('\nLogin credentials:');
            console.log('Email:', email);
            console.log('Password:', password);
            console.log('\nLogin at: http://localhost:3000/dashboard/login');
            return;
        }

        // Create new admin
        const hashedPassword = await hashPassword(password);
        const admin = await prisma.adminUser.create({
            data: {
                email,
                password: hashedPassword,
                name,
                isApproved: true, // First admin is auto-approved
            },
        });

        console.log('✅ First admin user created successfully!\n');
        console.log('Login credentials:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Status: Approved');
        console.log('\nYou can now login at: http://localhost:3000/dashboard/login');

    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createFirstAdmin();
