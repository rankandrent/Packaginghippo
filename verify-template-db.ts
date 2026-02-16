
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Checking PageTemplate model...')
        // @ts-ignore
        if (!prisma.pageTemplate) {
            console.error('prisma.pageTemplate is undefined!')
            return
        }

        // @ts-ignore
        const templates = await prisma.pageTemplate.findMany()
        console.log('Current templates count:', templates.length)

        // @ts-ignore
        const newTemplate = await prisma.pageTemplate.create({
            data: {
                name: 'Test Template ' + Date.now(),
                type: 'product',
                sections: []
            }
        })
        console.log('Created test template:', newTemplate.id)

        // @ts-ignore
        await prisma.pageTemplate.delete({ where: { id: newTemplate.id } })
        console.log('Deleted test template successfully.')
    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
