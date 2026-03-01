require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

console.log("Testing connection...");
const prisma = new PrismaClient({ log: ['info', 'query', 'warn', 'error'] });

async function main() {
    try {
        console.log("Calling findFirst...");
        const blog = await prisma.blogPost.findFirst();
        console.log("Success! Found a blog or null:");
        console.log(blog ? blog.slug : "No blogs");
    } catch (e) {
        console.log("Error:", e);
    } finally {
        await prisma.$disconnect();
        console.log("Disconnected.");
    }
}

main();
