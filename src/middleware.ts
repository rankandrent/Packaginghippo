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
    const normalized = url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
    // Lowercase for case-insensitive matching
    return normalized.toLowerCase();
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get('host')?.toLowerCase() || '';
    const hostname = host.split(':')[0];
    const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
    const protocol = forwardedProto || request.nextUrl.protocol.replace(':', '');

    if (
        (hostname === 'packaginghippo.com' || hostname === 'www.packaginghippo.com') &&
        (hostname !== 'packaginghippo.com' || protocol !== 'https')
    ) {
        const canonicalUrl = request.nextUrl.clone();
        canonicalUrl.protocol = 'https:';
        canonicalUrl.hostname = 'packaginghippo.com';
        canonicalUrl.port = '';

        return NextResponse.redirect(canonicalUrl, 301);
    }

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

    // --- Protect admin/CMS API routes ---
    // These were fully open before (anyone could edit content, settings,
    // redirects, or upload files without logging in). Now they require a valid
    // admin session. Public APIs stay open: /api/inquiry, /api/search,
    // /api/chat/*, /api/auth/*, /api/redirect-lookup, and order CREATION
    // (checkout POST /api/orders).
    if (pathname.startsWith('/api')) {
        const adminApiPrefixes = ['/api/cms', '/api/upload', '/api/media', '/api/redirects'];
        const isAdminApi =
            adminApiPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
            (pathname.startsWith('/api/orders') && request.method !== 'POST');

        if (isAdminApi && !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
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

            // Middleware (Edge runtime) can't use Prisma directly, so it calls the
            // redirect-lookup API internally. The right origin differs per host:
            // - Coolify/Docker: the public URL isn't reachable from inside the
            //   container, and the app may listen on a custom PORT.
            // - Local/dev: localhost:3000 works.
            // Try several candidates in order until one responds.
            const port = process.env.PORT || '3000';
            const candidateOrigins = Array.from(new Set([
                process.env.INTERNAL_API_URL,
                `http://127.0.0.1:${port}`,
                `http://localhost:${port}`,
                request.nextUrl.origin,
            ].filter(Boolean) as string[]));

            let redirectData: { found?: boolean; targetUrl?: string; type?: number } | null = null;
            for (const origin of candidateOrigins) {
                try {
                    const res = await fetch(
                        `${origin}/api/redirect-lookup?sourceUrl=${encodeURIComponent(normalizedPath)}`,
                        { cache: 'no-store' }
                    );
                    if (res.ok) {
                        redirectData = await res.json();
                        break;
                    }
                } catch {
                    // Try the next candidate origin.
                }
            }

            if (redirectData?.found && redirectData.targetUrl) {
                const statusCode = redirectData.type === 302 ? 302 : 301;

                // Handle both absolute URLs (https://...) and relative paths (/page)
                const targetUrl = redirectData.targetUrl.startsWith('http')
                    ? redirectData.targetUrl
                    : new URL(redirectData.targetUrl, request.url).toString();

                return NextResponse.redirect(targetUrl, statusCode);
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
