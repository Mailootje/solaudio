import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Fetch the user by email
        const [rows] = await pool.query('SELECT * FROM Users WHERE EMAIL = ?', [email]);

        if ((rows as any[]).length === 0) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        const user = (rows as any[])[0];

        // Compare the password
        const match = await bcrypt.compare(password, user.PASSWORD);

        if (!match) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.ID, email: user.EMAIL }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        // Set the token as an HTTP-only cookie
        const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Use 'lax' for authentication cookies
            maxAge: 60 * 60, // 1 hour
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}
