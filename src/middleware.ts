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

// Normalize source URL for consistent matching
function normalizeSourceUrl(url: string): string {
    // Remove trailing slash (except for root "/")
    let normalized = url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
    // Lowercase for case-insensitive matching
    return normalized.toLowerCase();
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
    // Skip static files, _next, api routes, and dashboard
    const shouldCheckRedirect = !pathname.startsWith('/_next') &&
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/dashboard') &&
        (!pathname.includes('.') || pathname.endsWith('.html'));

    if (shouldCheckRedirect) {
        try {
            // Normalize the pathname for matching
            const normalizedPath = normalizeSourceUrl(pathname);

            // In Docker/Coolify production, the public URL can't be reached internally.
            // Always use localhost:3000 for internal API calls to avoid container networking issues.
            const internalOrigin = process.env.INTERNAL_API_URL || 'http://localhost:3000';
            const redirectCheckUrl = `${internalOrigin}/api/redirect-lookup?sourceUrl=${encodeURIComponent(normalizedPath)}`;

            const redirectRes = await fetch(redirectCheckUrl, { cache: 'no-store' });

            if (redirectRes.ok) {
                const redirectData = await redirectRes.json();
                if (redirectData.found && redirectData.targetUrl) {
                    const statusCode = redirectData.type === 302 ? 302 : 301;

                    // Handle both absolute URLs (https://...) and relative paths (/page)
                    const targetUrl = redirectData.targetUrl.startsWith('http')
                        ? redirectData.targetUrl
                        : new URL(redirectData.targetUrl, request.url).toString();

                    return NextResponse.redirect(targetUrl, statusCode);
                }
            }
        } catch (error) {
            // Silently fail - don't block page loading if redirect check fails
            console.error('Middleware redirect lookup failed:', error);
        }
    }

    const response = NextResponse.next();
    response.headers.set('x-invoke-path', pathname);
    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|icon.svg).*)'],
};
