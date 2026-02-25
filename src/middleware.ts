import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

async function verifyTokenEdge(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public auth pages - redirect to dashboard if already logged in
    const authPages = ['/dashboard/login', '/dashboard/signup', '/dashboard/forgot-password'];
    const isAuthPage = authPages.some(page => pathname.startsWith(page));

    // Protected dashboard pages
    const isDashboardPage = pathname.startsWith('/dashboard') && !isAuthPage && !pathname.startsWith('/dashboard/reset-password');

    const token = request.cookies.get('admin-token')?.value;
    const user = token ? await verifyTokenEdge(token) : null;

    // Redirect to login if accessing protected page without auth
    if (isDashboardPage && !user) {
        return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }

    // Redirect to dashboard if accessing auth pages while logged in
    if (isAuthPage && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // --- Dynamic Redirect Logic (SEO) ---
    // Only check for redirects on page requests (not static, api, or internal)
    const isStaticPath = pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/api')

    if (!isStaticPath) {
        try {
            // Check for custom redirects in the database
            const redirectCheckUrl = new URL(`/api/redirect-lookup?sourceUrl=${encodeURIComponent(pathname)}`, request.url)
            const redirectRes = await fetch(redirectCheckUrl)

            if (redirectRes.ok) {
                const redirectData = await redirectRes.json()
                if (redirectData.found && redirectData.targetUrl) {
                    // Use the status code from the database (default 301)
                    const statusCode = redirectData.type === 302 ? 302 : 301
                    return NextResponse.redirect(new URL(redirectData.targetUrl, request.url), statusCode)
                }
            }
        } catch (error) {
            console.error('Middleware redirect error:', error)
        }
    }

    const response = NextResponse.next();
    response.headers.set('x-invoke-path', pathname);
    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
