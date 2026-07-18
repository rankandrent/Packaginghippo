import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { hashPassword, validateEmail, validatePassword, getCurrentUser } from '@/lib/auth'

// All routes here are gated to ADMIN role by middleware (adminOnlyApiPrefixes).

const SAFE_SELECT = {
    id: true,
    email: true,
    name: true,
    role: true,
    isApproved: true,
    createdAt: true,
}

export async function GET() {
    try {
        const users = await prisma.adminUser.findMany({
            select: SAFE_SELECT,
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(users)
    } catch (error) {
        console.error('Failed to fetch users:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

// Admin directly creates a new team member: approved immediately, role chosen up front.
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, name, role } = body

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }
        if (!validateEmail(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
            return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
        }
        const normalizedRole = role === 'ADMIN' ? 'ADMIN' : 'STAFF'

        const existing = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } })
        if (existing) {
            return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
        }

        const hashedPassword = await hashPassword(password)
        const user = await prisma.adminUser.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name: name || null,
                role: normalizedRole,
                isApproved: true,
            },
            select: SAFE_SELECT,
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error('Failed to create user:', error)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }
}

// Update a user's role and/or approval status.
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, role, isApproved } = body
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        const data: { role?: string; isApproved?: boolean } = {}
        if (role !== undefined) data.role = role === 'ADMIN' ? 'ADMIN' : 'STAFF'
        if (isApproved !== undefined) data.isApproved = Boolean(isApproved)

        // Don't allow demoting the last remaining admin (would lock everyone out of user management).
        if (data.role === 'STAFF') {
            const adminCount = await prisma.adminUser.count({ where: { role: 'ADMIN' } })
            const target = await prisma.adminUser.findUnique({ where: { id }, select: { role: true } })
            if (target?.role === 'ADMIN' && adminCount <= 1) {
                return NextResponse.json({ error: 'Cannot demote the last remaining admin' }, { status: 400 })
            }
        }

        const user = await prisma.adminUser.update({ where: { id }, data, select: SAFE_SELECT })
        return NextResponse.json(user)
    } catch (error) {
        console.error('Failed to update user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        const currentUser = await getCurrentUser()
        if (currentUser?.userId === id) {
            return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
        }

        const target = await prisma.adminUser.findUnique({ where: { id }, select: { role: true } })
        if (target?.role === 'ADMIN') {
            const adminCount = await prisma.adminUser.count({ where: { role: 'ADMIN' } })
            if (adminCount <= 1) {
                return NextResponse.json({ error: 'Cannot delete the last remaining admin' }, { status: 400 })
            }
        }

        await prisma.adminUser.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete user:', error)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }
}
