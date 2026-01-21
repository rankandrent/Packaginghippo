import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, validatePassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { error: passwordValidation.message },
                { status: 400 }
            );
        }

        // Find valid token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        if (resetToken.used) {
            return NextResponse.json(
                { error: 'This reset token has already been used' },
                { status: 400 }
            );
        }

        if (new Date() > resetToken.expiresAt) {
            return NextResponse.json(
                { error: 'This reset token has expired' },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.adminUser.findUnique({
            where: { email: resetToken.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update password
        const hashedPassword = await hashPassword(password);
        await prisma.adminUser.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        // Mark token as used
        await prisma.passwordResetToken.update({
            where: { token },
            data: { used: true },
        });

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Failed to reset password' },
            { status: 500 }
        );
    }
}
