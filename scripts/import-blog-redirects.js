const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CSV_PATH = path.join(require('os').homedir(), 'Downloads', 'oxopackaging.com-top-pages-subdomains-all-_2025-10-27_18-09-50.csv');

async function main() {
    console.log('--- Importing Blog Redirects ---');

    if (!fs.existsSync(CSV_PATH)) {
        console.error('CSV file not found at:', CSV_PATH);
        return;
    }

    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n');

    let count = 0;
    for (const line of lines) {
        if (!line.trim()) continue;

        // Simple CSV split (assuming no commas in URLs)
        const columns = line.split(',');
        const urlObjStr = columns[0].replace(/^"|"$/g, '').trim();

        if (urlObjStr.includes('/blog/')) {
            try {
                // Determine source path from URL string
                const url = new URL(urlObjStr);
                const sourcePath = url.pathname; // e.g., /blog/length-width-height-dimensions.html

                // Remove .html for the target path
                const targetPath = sourcePath.replace(/\.html$/, '');

                if (sourcePath && targetPath && sourcePath !== targetPath) {
                    await prisma.redirect.upsert({
                        where: { sourceUrl: sourcePath },
                        update: {
                            targetUrl: targetPath,
                            type: 301,
                            isActive: true
                        },
                        create: {
                            sourceUrl: sourcePath,
                            targetUrl: targetPath,
                            type: 301,
                            isActive: true
                        }
                    });
                    count++;
                }
            } catch (e) {
                // Ignore parsing errors for invalid URL strings
            }
        }
    }

    console.log(`Successfully imported ${count} blog redirects.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
