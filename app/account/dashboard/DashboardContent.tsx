'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import PasswordResetForm from './PasswordResetForm';
import Image from 'next/image';

interface DashboardContentProps {
    user: {
        EMAIL: string;
        USERNAME: string;
    };
}

export default function DashboardContent({ user }: DashboardContentProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            router.push('/account/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="text-center py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-8">
                    <Image
                        src="/SolAudio.png"
                        alt="SolAudio Logo"
                        width={150}
                        height={150}
                        className="mx-auto mb-6"
                    />
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
                        Your <span className="text-[#9945FF]">Account</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                        Manage your account details
                    </p>
                </div>
            </header>

            {/* Account Information */}
            <main className="flex-grow container mx-auto px-8 py-8">
                <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        Account Details
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Email:</strong> {user.EMAIL}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        <strong>Username:</strong> {user.USERNAME}
                    </p>

                    {/* Password Reset Form */}
                    <PasswordResetForm />

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="mt-4 w-full bg-red-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition duration-300"
                    >
                        Log Out
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 dark:bg-gray-900 py-8">
                {/* ... Include your footer content here ... */}
            </footer>
        </div>
    );
}