'use client';

import { useState } from 'react';
import axios from 'axios';

export default function PasswordResetForm() {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/api/reset-password', {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            });
            setSuccess(response.data.message);
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Reset Password
            </h2>
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
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                        Current Password
                    </label>
                    <input
                        type="password"
                        required
                        value={formData.oldPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, oldPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#9945FF] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                        New Password
                    </label>
                    <input
                        type="password"
                        required
                        value={formData.newPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, newPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#9945FF] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#9945FF] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#14F195] text-gray-900 font-semibold px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition duration-300"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}
