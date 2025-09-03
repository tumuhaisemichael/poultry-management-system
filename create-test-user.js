const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // First, let's check what the actual schema looks like
    console.log('Checking database schema...');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'admin@example.com',
      },
    });

    if (existingUser) {
      console.log('User already exists:', existingUser);
      return;
    }

    // Let's see what fields are actually available in the User model
    // by trying to create a user with minimal fields first
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    console.log('Attempting to create user with minimal fields...');
    
    // Try creating user with just email and password first
    const user = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        // Don't specify role initially - let's see what the default is
        emailVerified: true,
      },
    });
    
    console.log('Successfully created user:', user);
    console.log('You can now login with:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error details:', error);
    
    // If that fails, let's check what the actual User model structure is
    try {
      const userCount = await prisma.user.count();
      console.log(`Total users in database: ${userCount}`);
      
      // Try to see what fields actually exist by looking at the first user
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        console.log('Example user structure:', firstUser);
      }
    } catch (e) {
      console.error('Could not examine users table:', e);
    }
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });