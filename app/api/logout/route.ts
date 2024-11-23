import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
    // Clear the authentication token by setting an expired cookie
    const expiredCookie = serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0), // Set the cookie to expire immediately
        path: '/',
    });

    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.headers.set('Set-Cookie', expiredCookie);

    return response;
}
