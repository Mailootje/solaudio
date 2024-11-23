import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { oldPassword, newPassword } = await request.json();

        // Get the token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Decode the token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

        // Fetch the user's current password hash from the database
        const [rows] = await pool.query('SELECT PASSWORD FROM Users WHERE ID = ?', [decoded.id]);

        if ((rows as any[]).length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const user = (rows as any[])[0];

        // Compare the old password
        const match = await bcrypt.compare(oldPassword, user.PASSWORD);

        if (!match) {
            return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await pool.query('UPDATE Users SET PASSWORD = ? WHERE ID = ?', [hashedPassword, decoded.id]);

        return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}