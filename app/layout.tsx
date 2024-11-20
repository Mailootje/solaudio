// src/app/layout.tsx

import './globals.css'; // Import global styles
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'SolAudio',
    description: 'Explore radio stations worldwide',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-gray-50 dark:bg-gray-900">
        {/* Navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <nav className="container mx-auto flex justify-between items-center py-4 px-6">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/SolAudioLogo.svg"
                        alt="SolAudio Logo"
                        width={40}
                        height={40}
                        className="mr-2"
                    />
                    <span className="text-2xl font-bold text-[#9945FF] dark:text-[#14F195]">
                SolAudio
              </span>
                </Link>
                <div className="space-x-6">
                    <Link
                        href="/radio"
                        className="text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                    >
                        Radio
                    </Link>
                    <Link
                        href="/about"
                        className="text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className="text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                    >
                        Contact
                    </Link>
                </div>
            </nav>
        </header>

        {/* Main Content */}
        <main>{children}</main>
        </body>
        </html>
    );
}