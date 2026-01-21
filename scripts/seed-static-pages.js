const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding static pages...')

    const pages = [
        {
            title: 'Privacy Policy',
            slug: 'privacy-policy',
            content: `
                <h2>Privacy Policy</h2>
                <p>Welcome to Packaging Hippo. Your privacy is important to us. It is Packaging Hippo's policy to respect your privacy regarding any information we may collect from you across our website.</p>
                <h3>1. Information We Collect</h3>
                <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
                <h3>2. Use of Information</h3>
                <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft.</p>
                <h3>3. Cookies</h3>
                <p>We use cookies to help us understand how you use our site and where we can improve.</p>
            `,
            isPublished: true,
            seoTitle: 'Privacy Policy | Packaging Hippo',
            seoDesc: 'Read our privacy policy to understand how we handle your data.'
        },
        {
            title: 'Terms & Conditions',
            slug: 'terms-and-conditions',
            content: `
                <h2>Terms & Conditions</h2>
                <p>By accessing our website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                <h3>1. Use License</h3>
                <p>Permission is granted to temporarily download one copy of the materials (information or software) on Packaging Hippo's website for personal, non-commercial transitory viewing only.</p>
                <h3>2. Disclaimer</h3>
                <p>The materials on Packaging Hippo's website are provided on an 'as is' basis. Packaging Hippo makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
            `,
            isPublished: true,
            seoTitle: 'Terms & Conditions | Packaging Hippo',
            seoDesc: 'Terms of service and conditions for using Packaging Hippo.'
        },
        {
            title: 'About Us',
            slug: 'about-us',
            content: `
                <h2>About Packaging Hippo</h2>
                <p>Packaging Hippo is a leader in custom packaging solutions. We provide high-quality, eco-friendly, and customizable boxes for businesses of all sizes.</p>
                <p>Our mission is to help brands elevate their unboxing experience through premium design and sustainable materials.</p>
            `,
            isPublished: true,
            seoTitle: 'About Us | Packaging Hippo',
            seoDesc: 'Learn more about Packaging Hippo and our mission.'
        }
    ]

    for (const page of pages) {
        await prisma.page.upsert({
            where: { slug: page.slug },
            update: page,
            create: page,
        })
        console.log(`- Upserted page: ${page.title}`)
    }

    console.log('Seeding complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
