const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- Seeding Blog Data ---')

    // 1. Create Author
    const expert = await prisma.author.upsert({
        where: { slug: 'sarah-jenkins' },
        update: {},
        create: {
            name: 'Sarah Jenkins',
            slug: 'sarah-jenkins',
            role: 'Senior Packaging Consultant',
            bio: 'With over 15 years in the packaging industry, Sarah specializes in sustainable materials and cost-effective shipping solutions for e-commerce brands.',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
            socialLinks: { twitter: 'sarahpacks', linkedin: 'sarah-jenkins-packaging' }
        }
    })

    // 2. Create Category
    const category = await prisma.blogCategory.upsert({
        where: { slug: 'industry-trends' },
        update: {},
        create: {
            name: 'Industry Trends',
            slug: 'industry-trends',
            description: 'Stay updated with the latest in packaging technology and design.'
        }
    })

    // 3. Create Blog Post
    await prisma.blogPost.upsert({
        where: { slug: 'future-of-eco-friendly-packaging-2024' },
        update: {},
        create: {
            title: 'The Future of Eco-Friendly Packaging in 2024',
            slug: 'future-of-eco-friendly-packaging-2024',
            excerpt: 'Discover why sustainable packaging is no longer optional for modern brands and what trends are shaping the next year.',
            content: `
                <h2>Quick Overview</h2>
                <p>Sustainable packaging has moved from a "nice to have" to a core business requirement. As consumers become more environmentally conscious, brands that prioritize eco-friendly solutions are seeing higher loyalty and better market performance.</p>
                
                <h2>Key Benefits</h2>
                <p>Switching to sustainable materials like recycled cardboard and biodegradable plastics not only reduces your carbon footprint but can also lower shipping costs through optimized design.</p>
                
                <h2>Design Strategies</h2>
                <p>Minimalism is key. By reducing the amount of raw material used without compromising structural integrity, you create a "unboxing experience" that feels premium and responsible.</p>
                
                <h2>Conclusion</h2>
                <p>The transition to green packaging is a journey. Starting with small changes like soy-based inks can lead to significant long-term impacts.</p>
            `,
            mainImage: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=1200&h=675',
            authorId: expert.id,
            categoryId: category.id,
            seoTitle: 'Eco-Friendly Packaging Trends 2024 | Expert Guide',
            seoDesc: 'Learn the latest sustainable packaging trends for 2024 from industry experts. Improve your brand EEAT with eco-conscious solutions.',
            isPublished: true,
            publishedAt: new Date()
        }
    })

    console.log('Seeding completed successfully!')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
