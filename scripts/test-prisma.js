const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const redirect = await prisma.redirect.findUnique({
        where: { sourceUrl: '/blog/length-width-height-dimensions.html' }
    });
    console.log('Redirect mapping found:', redirect);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
