import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    console.log("Starting DB content link update via API...");

    const replaceLinks = (contentStr: string) => {
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

    const processContent = (content: any) => {
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
        let blogUpdates = 0;
        const blogs = await prisma.blogPost.findMany({ select: { id: true, content: true } });
        for (const blog of blogs) {
            const newContent = processContent(blog.content);
            if (newContent !== blog.content) {
                await prisma.blogPost.update({
                    where: { id: blog.id },
                    data: { content: newContent as any }
                });
                blogUpdates++;
            }
        }

        let categoryUpdates = 0;
        const categories = await prisma.productCategory.findMany({ select: { id: true, description: true } });
        for (const cat of categories) {
            if (cat.description) {
                const newDesc = processContent(cat.description);
                if (newDesc !== cat.description) {
                    await prisma.productCategory.update({
                        where: { id: cat.id },
                        data: { description: newDesc as any }
                    });
                    categoryUpdates++;
                }
            }
        }

        let productUpdates = 0;
        const products = await prisma.product.findMany({ select: { id: true, description: true, content: true, tabs: true } });
        for (const prod of products) {
            let updated = false;
            let dataToUpdate: any = {};
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

        return NextResponse.json({
            success: true,
            updates: {
                blogs: blogUpdates,
                categories: categoryUpdates,
                products: productUpdates
            }
        });

    } catch (err: any) {
        console.error("Error during execution:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
