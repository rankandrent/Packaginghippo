const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://custom-packaging.org/sitemap.xml

# Crawl-delay
Crawl-delay: 10

# Disallow patterns
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /*?*

# Allow patterns
Allow: /*.html$
Allow: /*.htm$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.gif$
Allow: /*.png$
Allow: /*.css$
Allow: /*.js$`;

async function main() {
    console.log('Seeding robots.txt settings...');
    const setting = await prisma.siteSettings.upsert({
        where: { key: 'robots' },
        update: {
            value: robotsContent,
            updatedAt: new Date(),
        },
        create: {
            key: 'robots',
            value: robotsContent,
        },
    });
    console.log('Successfully applied robots.txt to database:', setting);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
