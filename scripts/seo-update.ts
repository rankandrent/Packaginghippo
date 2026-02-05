import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting SEO data updates...')

    // 1. Update Hero Image
    await prisma.homepageSection.update({
        where: { sectionKey: 'hero' },
        data: {
            content: {
                set: {
                    heading: "Custom Boxes & Custom Packaging Shipping Boxes",
                    subheading: "Whether you run a small business or an established business. You always need a custom box and a custom packaging solution that can offer your product durable protection.",
                    ctaText: "Get Custom Quote",
                    ctaLink: "/quote",
                    secondaryCtaText: "View All Products",
                    secondaryCtaLink: "/products",
                    badges: ["No Die & Plate Charges", "Fast Turnaround"],
                    hero_image: "/images/hero/custom-package-interior.webp"
                }
            }
        }
    })
    console.log('✅ Hero image updated.')

    // 2. Expand About Us page content
    const aboutUsContent = `
    <article>
      <h2>Expert Custom Packaging Solutions for Your Brand</h2>
      <p>At Packaging Hippo, we specialize in providing high-quality, custom packaging solutions that help brands stand out in a competitive marketplace. With years of experience in the industrial packaging sector, we understand that your packaging is not just a container—it's the first physical touchpoint your customer has with your brand.</p>
      
      <h3>Our Mission and Values</h3>
      <p>Our mission is to empower businesses of all sizes with premium, sustainable, and cost-effective packaging options. We believe in transparency, innovation, and exceptional customer service. From startups to established enterprises, we provide the same level of dedication and creative support to ensure your product is protected and presented perfectly.</p>
      
      <h3>Why Choose Packaging Hippo?</h3>
      <p>We've served over 500+ happy clients across various industries, including cosmetics, food and beverage, electronics, and pharmaceuticals. Our team of design experts offers free consultations to help you navigate materials, printing techniques, and structural designs that resonate with your target audience.</p>
      
      <h3>Commitment to Sustainability</h3>
      <p>We are transitioing towards more eco-friendly materials and sustainable manufacturing processes. We offer a wide range of recyclable and biodegradable packaging options to help your brand reduce its environmental footprint without compromising on quality or aesthetics.</p>
    </article>
  `
    await prisma.page.update({
        where: { slug: 'about-us' },
        data: {
            content: aboutUsContent
        }
    })
    console.log('✅ About Us page expanded.')

    // 3. Clean up blog slugs (remove trailing hyphens)
    const posts = await (prisma as any).blogPost.findMany({
        where: {
            slug: {
                endsWith: '-'
            }
        }
    })

    for (const post of posts) {
        const newSlug = post.slug.replace(/-+$/, '')
        await (prisma as any).blogPost.update({
            where: { id: post.id },
            data: { slug: newSlug }
        })
        console.log(`✅ Updated slug: ${post.slug} -> ${newSlug}`)
    }

    console.log('SEO data updates completed successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
