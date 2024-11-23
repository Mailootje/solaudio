'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (success) {
            // Redirect to login page after 3 seconds
            const timer = setTimeout(() => {
                router.push('/account/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await axios.post('/api/register', formData);
            setSuccess('Registration successful! Redirecting to login page...');
            // Clear the form
            setFormData({
                email: '',
                username: '',
                password: '',
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
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
                        Join <span className="text-[#9945FF]">SolAudio</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                        Create an account and start your musical journey
                    </p>
                </div>
            </header>

            {/* Registration Form */}
            <main className="flex-grow container mx-auto px-8 py-8">
                <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">
                            {success}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#9945FF] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                disabled={!!success}
                            />
                        </div>
                        {/* Username Field */}
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#9945FF] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                disabled={!!success}
                            />
                        </div>
                        {/* Password Field */}
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#9945FF] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                disabled={!!success}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#14F195] text-gray-900 font-semibold px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition duration-300"
                            disabled={!!success}
                        >
                            Register
                        </button>
                    </form>
                    {!success && (
                        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <a href="/account/login" className="text-[#9945FF] hover:underline">
                                Log in here
                            </a>
                        </p>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 dark:bg-gray-900 py-8">
                {/* Include the same footer content from your main page */}
            </footer>
        </div>
    );
}
