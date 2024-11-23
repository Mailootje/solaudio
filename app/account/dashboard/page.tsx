import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { redirect } from 'next/navigation';
import DashboardContent from './DashboardContent';

export default async function AccountPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        // Redirect to login page if not authenticated
        redirect('/account/login');
    }

    let user;

    try {
        // Verify and decode the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };

        // Fetch the user's data from the database
        const [rows] = await pool.query('SELECT EMAIL, USERNAME FROM Users WHERE ID = ?', [decoded.id]);

        if ((rows as any[]).length === 0) {
            // User not found, redirect to login
            redirect('/account/login');
        }

        user = (rows as any[])[0];
    } catch (error) {
        // Invalid token, redirect to login
        redirect('/account/login');
    }

    return <DashboardContent user={user} />;
}
