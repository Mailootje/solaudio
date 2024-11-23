import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define public routes that do not require authentication
    const publicRoutes = ['/account/login', '/account/register', '/account/forgot-password'];

    // Apply middleware only to protected routes
    if (pathname.startsWith('/account') || pathname.startsWith('/api/reset-password')) {
        // Allow access to public routes
        if (publicRoutes.some((route) => pathname.startsWith(route))) {
            return NextResponse.next();
        }

        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/account/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            console.error('JWT verification failed:', error);
            return NextResponse.redirect(new URL('/account/login', request.url));
        }
    }

    // Allow all other requests
    return NextResponse.next();
}

export const config = {
    matcher: ['/account/:path*', '/api/reset-password/:path*'],
};