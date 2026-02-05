import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addCustomQuoteSection() {
    console.log('Adding custom quote form section...')

    try {
        // Check if the section already exists
        const existing = await prisma.homepageSection.findUnique({
            where: { sectionKey: 'custom_quote_form' }
        })

        if (existing) {
            console.log('Custom quote form section already exists. Updating...')
            await prisma.homepageSection.update({
                where: { sectionKey: 'custom_quote_form' },
                data: {
                    title: 'Custom Quote Form',
                    content: {
                        image: '' // Empty by default, can be set from dashboard
                    },
                    order: 50, // Position it before testimonials
                    isActive: true
                }
            })
            console.log('✅ Custom quote form section updated.')
        } else {
            await prisma.homepageSection.create({
                data: {
                    sectionKey: 'custom_quote_form',
                    title: 'Custom Quote Form',
                    content: {
                        image: '' // Empty by default, editable from dashboard
                    },
                    order: 50,
                    isActive: true
                }
            })
            console.log('✅ Custom quote form section created.')
        }
    } catch (error) {
        console.error('Error adding custom quote section:', error)
    } finally {
        await prisma.$disconnect()
    }
}

addCustomQuoteSection()
