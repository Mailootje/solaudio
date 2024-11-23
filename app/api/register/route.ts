import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { email, username, password } = await request.json();

        // Check if the email or username already exists
        const [rows] = await pool.query(
            'SELECT * FROM Users WHERE EMAIL = ? OR USERNAME = ?',
            [email, username]
        );

        if ((rows as any[]).length > 0) {
            return NextResponse.json(
                { message: 'Email or username already exists' },
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        await pool.query(
            'INSERT INTO Users (EMAIL, USERNAME, PASSWORD) VALUES (?, ?, ?)',
            [email, username, hashedPassword]
        );

        return NextResponse.json(
            { message: 'User registered successfully' },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error', error },
            { status: 500 }
        );
    }
}
