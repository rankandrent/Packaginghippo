import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // ============================================
    // SITE SETTINGS
    // ============================================
    await prisma.siteSettings.upsert({
        where: { key: 'general' },
        update: {},
        create: {
            key: 'general',
            value: {
                siteName: 'Packaging Hippo',
                tagline: 'Custom Boxes & Packaging Solutions',
                phone: '(510) 500-9533',
                email: 'sales@packaginghippo.com',
                address: '123 Packaging Street, Industrial District, NY 10001',
                logoUrl: '/logo.png',
            },
        },
    })

    await prisma.siteSettings.upsert({
        where: { key: 'seo' },
        update: {},
        create: {
            key: 'seo',
            value: {
                defaultTitle: 'Packaging Hippo | Custom Boxes & Packaging Solutions',
                defaultDescription: 'Premium custom packaging boxes with your logo. Get a free quote today. Custom mailer boxes, rigid boxes, and eco-friendly packaging.',
                defaultKeywords: 'custom boxes, packaging, mailer boxes, rigid boxes, custom packaging, branded boxes',
                ogImage: '/og-image.jpg',
            },
        },
    })

    // ============================================
    // HOMEPAGE SECTIONS
    // ============================================
    const homepageSections = [
        {
            sectionKey: 'hero',
            title: 'Hero Section',
            order: 1,
            content: {
                heading: 'Custom Boxes & Custom Packaging Shipping Boxes',
                subheading: 'Whether you run a small business or an established business. You always need a custom box and a custom packaging solution that can offer your product durable protection.',
                ctaText: 'Get Custom Quote',
                ctaLink: '/quote',
                secondaryCtaText: 'View All Products',
                secondaryCtaLink: '/products',
                badges: ['No Die & Plate Charges', 'Fast Turnaround'],
            },
        },
        {
            sectionKey: 'intro',
            title: 'Introduction',
            order: 2,
            content: {
                heading: 'Custom Packaging Solution for Every Business',
                text: 'We provide packaging that is not just a container, but it is a physical interaction between customers and our brand. It does not matter if you are a retailer who operates online or has a physical store. We deliver our custom packaging at your doorstep to help you create a memorable unboxing experience for your customer.',
            },
        },
        {
            sectionKey: 'services_list',
            title: 'Services List',
            order: 3,
            content: {
                heading: 'We offer custom boxes like',
                items: [
                    'Custom Printed Boxes',
                    'Custom Rigid Boxes',
                    'Gift Boxes',
                    'Cosmetic Boxes',
                    'Food and Beverages Boxes',
                    'Bakery Boxes',
                    'Apparel Gift Boxes',
                    'Premium Box Packaging',
                    'Custom Corrugated Boxes',
                    'Custom Shipping Boxes',
                    'Pop-Up Lid Boxes',
                    'Bottom Closure',
                    'Wholesale and Retail Packaging Boxes',
                ],
            },
        },
        {
            sectionKey: 'benefits',
            title: 'Benefits Section',
            order: 4,
            content: {
                heading: 'How Custom Packaging Can Boost Your Brand',
                intro: 'Brands always make one mistake when they have to make a choice between the packaging. They always go for the generic boxes, which are no longer appealing to the customers.',
                items: [
                    { title: 'Unforgettable impression', desc: 'Our Custom boxes help your brand to give your customers a first unforgettable impression.' },
                    { title: 'Perfect for shipping and storing', desc: 'Our boxes offer your product a perfect and reliable cushioning and shock absorption during storage and shipping.' },
                    { title: 'Customizable', desc: 'They build your brand identity through our vibrant and versatile colors, logo, and design printings.' },
                    { title: 'Customer satisfaction', desc: 'You can improve your customers\' satisfaction and gain their loyalty.' },
                ],
            },
        },
        {
            sectionKey: 'how_it_works',
            title: 'How It Works',
            order: 5,
            content: {
                heading: 'How We Turn Your Ideas Into Reality',
                text: 'Being a successful manufacturing brand ourselves, we understand that every successful brand depends on the wonderful idea of packaging.',
                subsections: [
                    { title: 'Free Design Assistance And 3D Mockups', desc: 'We offer expert graphic designers who give you free design assistance and 3D mockups.' },
                    { title: 'Unlimited Customization Options', desc: 'You can get your boxes customized in any shape, size, style, or design.' },
                    { title: 'Custom Inserts And Dividers', desc: 'You can get custom dividers and inserts, and different types of box closures from us.' },
                    { title: 'Premium Quality Materials', desc: 'We offer you both high-quality, durable materials that are designed beautifully.' },
                ],
            },
        },
        {
            sectionKey: 'eco_friendly',
            title: 'Eco-Friendly Section',
            order: 6,
            content: {
                heading: 'Eco-Friendly And Sustainable Packaging Solutions',
                text: 'Being an eco-conscious and environmentally friendly brand, we understand the importance of using eco-friendly packaging material.',
                materials: [
                    { name: 'Paperboard', desc: 'Strong and lightweight material that is totally biodegradable.' },
                    { name: 'Kraft Paper', desc: 'Made from 100% recyclable tree pulp. Cost-effective and reliable.' },
                    { name: 'Corrugated Cardboard', desc: 'Heavy-duty material made from triple-layer liner board for extra protection.' },
                    { name: 'Rigid Stock', desc: 'Premium quality material used for luxury and expansive look.' },
                ],
            },
        },
        {
            sectionKey: 'popular_products',
            title: 'Popular Products',
            order: 7,
            content: {
                heading: 'Most Popular Custom Box Types We Offer',
                items: [
                    { title: 'Custom Corrugated Cardboard Boxes', desc: 'Best for shipping and transportation, shock absorption.', link: '/products/corrugated-boxes' },
                    { title: 'Kraft Boxes', desc: 'Budget-friendly and lightweight options for retail and food.', link: '/products/kraft-boxes' },
                    { title: 'Custom Mailer Boxes', desc: 'Small and secure boxes mostly used by online retailers.', link: '/products/mailer-boxes' },
                    { title: 'Custom Shipping Boxes', desc: 'Sturdy and strong, do not tear apart during transportation.', link: '/products/shipping-boxes' },
                    { title: 'Rigid Boxes', desc: 'Premium packaging solution for luxury experience.', link: '/products/rigid-boxes' },
                    { title: 'Folding Boxes', desc: 'Lightweight and easy-to-assemble boxes, shipped flat.', link: '/products/folding-boxes' },
                ],
            },
        },
        {
            sectionKey: 'industries',
            title: 'Industries We Serve',
            order: 8,
            content: {
                heading: 'Industries We Serve',
                items: [
                    'Fragile items',
                    'Retail Packaging',
                    'Food & beverage packaging',
                    'Gift Packaging',
                    'Cosmetic products',
                    'Subscription boxes',
                ],
            },
        },
        {
            sectionKey: 'printing',
            title: 'Printing Section',
            order: 9,
            content: {
                heading: 'Bring Your Brand to Life Through Custom Printing',
                text: 'Packaging Hippo offers higher-quality custom printing that increases your brand\'s visual appearance. We offer printing options like digital printing, offset printing, screen printing, and flexography.',
                subheading: 'Free Logo Design For Your Brand',
                subtext: 'We offer free logo design services with the help of our creative team.',
            },
        },
        {
            sectionKey: 'steps',
            title: 'Design Steps',
            order: 10,
            content: {
                heading: 'Steps to Designing The Perfect Custom Boxes',
                steps: [
                    { step: 'Step 1', title: 'Understanding Your Product', desc: 'We design custom boxes that fit your product and complement your brand.' },
                    { step: 'Step 2', title: 'Choose The best Material', desc: 'Choose eco-friendly and sustainable materials.' },
                    { step: 'Step 3', title: 'Make Your Box', desc: 'Use your brand colors, logos, and messages in 2D and 3D.' },
                ],
            },
        },
        {
            sectionKey: 'why_choose_us',
            title: 'Why Choose Us',
            order: 11,
            content: {
                heading: 'Why Choose Packaging Hippo For Customized Boxes & Packaging?',
                text: 'We are the leading brand who are experts in custom boxes. Not only this, but we are also trusted by more than 5000 brands in the market right now.',
                points: [
                    'Wholesale rates',
                    'Great discounts',
                    'Fast and free design support and 3D mockups',
                    'Eco-friendly material',
                    'No minimum order requirement',
                    'Free sample kits and logo designing services',
                    '24x7 customer support',
                ],
            },
        },
        {
            sectionKey: 'faq',
            title: 'FAQ Section',
            order: 12,
            content: {
                heading: 'Frequently Asked Questions',
                items: [
                    { q: 'Why are custom boxes important to be printed with logos?', a: 'Custom boxes with logos play an important role in branding. It increases your brand recognition.' },
                    { q: 'Can I design my own custom box?', a: 'Yes, you can design your own custom box. Our expert digital graphic design team is 24/7 available to help you.' },
                    { q: 'What materials are used for custom-branded packaging?', a: 'We use strong materials such as paper, craft paper, cardboard, corrugated cardboard, and rigid stock.' },
                    { q: 'Do you offer custom-printed boxes?', a: 'Yes, we do offer custom printed boxes with advanced printing techniques.' },
                    { q: 'What is the turnaround time for your custom boxes?', a: 'We offer custom boxes in just 7 to 10 business days after your proof approval.' },
                    { q: 'Are your custom boxes reusable?', a: 'Yes, the material that we use in making these boxes is completely reusable and recyclable.' },
                ],
            },
        },
        {
            sectionKey: 'cta',
            title: 'Final CTA',
            order: 13,
            content: {
                heading: 'Ready to Elevate Your Brand?',
                text: 'Get a competitive price quote for your custom packaging project today.',
                primaryCtaText: 'Start Your Project',
                primaryCtaLink: '/quote',
                secondaryCtaText: 'Contact Support',
                secondaryCtaLink: '/contact',
            },
        },
    ]

    for (const section of homepageSections) {
        await prisma.homepageSection.upsert({
            where: { sectionKey: section.sectionKey },
            update: { content: section.content, title: section.title, order: section.order },
            create: section,
        })
    }

    // ============================================
    // PRODUCT CATEGORIES
    // ============================================
    const categories = [
        { name: 'Mailer Boxes', slug: 'mailer-boxes', description: 'Durable and stylish corrugated boxes perfect for e-commerce shipping.' },
        { name: 'Rigid Boxes', slug: 'rigid-boxes', description: 'Premium rigid setup boxes for luxury products and gifts.' },
        { name: 'Folding Cartons', slug: 'folding-cartons', description: 'Lightweight cardstock boxes for retail shelving and cosmetics.' },
        { name: 'Eco-Friendly', slug: 'eco-friendly', description: 'Sustainable kraft options made from 100% recycled materials.' },
        { name: 'Display Boxes', slug: 'display-boxes', description: 'Counter top displays designed to grab attention at checkout.' },
        { name: 'Food Packaging', slug: 'food-packaging', description: 'Food-grade safe materials for takeout, bakery, and produce.' },
    ]

    for (const cat of categories) {
        await prisma.productCategory.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, description: cat.description },
            create: cat,
        })
    }

    console.log('✅ Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
