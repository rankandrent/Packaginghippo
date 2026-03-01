require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function updateDbLinks() {
    console.log("Starting DB content link update...");

    // The regex finds:
    // (href="|href='|\.com)(/services/|/product/|/category/|/products/)([^"'\s]+)
    // And replaces the middle part with just /
    // We'll just do a simpler string replace for known patterns

    const replaceLinks = (contentStr) => {
        if (!contentStr) return contentStr;
        return contentStr
            .replace(/href="\/services\//g, 'href="/')
            .replace(/href='\/services\//g, "href='/")
            .replace(/href="\/product\//g, 'href="/')
            .replace(/href='\/product\//g, "href='/")
            .replace(/href="\/products\//g, 'href="/')
            .replace(/href='\/products\//g, "href='/")
            .replace(/href="\/category\//g, 'href="/')
            .replace(/href='\/category\//g, "href='/")
            .replace(/https:\/\/packaginghippo\.com\/services\//g, 'https://packaginghippo.com/')
            .replace(/https:\/\/packaginghippo\.com\/product\//g, 'https://packaginghippo.com/')
            .replace(/https:\/\/packaginghippo\.com\/products\//g, 'https://packaginghippo.com/')
            .replace(/https:\/\/packaginghippo\.com\/category\//g, 'https://packaginghippo.com/');
    };

    const processContent = (content) => {
        if (!content) return content;
        if (typeof content === 'string') {
            return replaceLinks(content);
        } else {
            try {
                const strContent = JSON.stringify(content);
                const updatedStr = replaceLinks(strContent);
                return JSON.parse(updatedStr);
            } catch (e) {
                console.error("Failed to parse JSON after replacement", e);
                return content;
            }
        }
    };

    try {
        console.log("Fetching blogs...");
        // Update Blogs
        const blogs = await prisma.blogPost.findMany({ select: { id: true, content: true } });
        let blogUpdates = 0;
        for (const blog of blogs) {
            const newContent = processContent(blog.content);
            if (newContent !== blog.content) {
                await prisma.blogPost.update({
                    where: { id: blog.id },
                    data: { content: newContent }
                });
                blogUpdates++;
            }
        }
        console.log(`Updated ${blogUpdates} blogs.`);

        console.log("Fetching categories...");
        // Update Categories
        const categories = await prisma.productCategory.findMany({ select: { id: true, description: true } });
        let categoryUpdates = 0;
        for (const cat of categories) {
            if (cat.description) {
                const newDesc = processContent(cat.description);
                if (newDesc !== cat.description) {
                    await prisma.productCategory.update({
                        where: { id: cat.id },
                        data: { description: newDesc }
                    });
                    categoryUpdates++;
                }
            }
        }
        console.log(`Updated ${categoryUpdates} categories.`);

        console.log("Fetching products...");
        // Update Products
        const products = await prisma.product.findMany({ select: { id: true, description: true, content: true, tabs: true } });
        let productUpdates = 0;
        for (const prod of products) {
            let updated = false;
            let dataToUpdate = {};
            if (prod.description) {
                const newDesc = processContent(prod.description);
                if (newDesc !== prod.description) {
                    dataToUpdate.description = newDesc;
                    updated = true;
                }
            }
            if (prod.content) {
                const newContent = processContent(prod.content);
                if (JSON.stringify(newContent) !== JSON.stringify(prod.content)) {
                    dataToUpdate.content = newContent;
                    updated = true;
                }
            }
            if (prod.tabs) {
                const newTabs = processContent(prod.tabs);
                if (JSON.stringify(newTabs) !== JSON.stringify(prod.tabs)) {
                    dataToUpdate.tabs = newTabs;
                    updated = true;
                }
            }
            if (updated) {
                await prisma.product.update({
                    where: { id: prod.id },
                    data: dataToUpdate
                });
                productUpdates++;
            }
        }
        console.log(`Updated ${productUpdates} products.`);

        console.log("Finished updating DB content links.");
    } catch (err) {
        console.error("Error during execution:", err);
    }
}

updateDbLinks()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("Disconnected Prisma.");
    });
