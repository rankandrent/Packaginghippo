import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { generateResetToken, validateEmail } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || !validateEmail(email)) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.adminUser.findUnique({
            where: { email: email.toLowerCase() },
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account with that email exists, a reset link will be sent',
            });
        }

        // Generate reset token
        const token = generateResetToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

        // Save token to database
        await prisma.passwordResetToken.create({
            data: {
                email: email.toLowerCase(),
                token,
                expiresAt,
            },
        });

        // TODO: Send email with reset link
        // For now, we'll just return the token (in production, send via email)
        console.log(`Password reset token for ${email}: ${token}`);
        console.log(`Reset URL: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/reset-password/${token}`);

        return NextResponse.json({
            success: true,
            message: 'If an account with that email exists, a reset link will be sent',
            // Remove this in production - only for testing
            ...(process.env.NODE_ENV === 'development' && { token }),
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
