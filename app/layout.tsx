"use client";

import './globals.css'; // Import global styles
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa'; // Import FontAwesome icons
import { MdRadio } from 'react-icons/md'; // Import Material Design icon for Radio
import { useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <html lang="en">
        <body className="bg-gray-50 dark:bg-gray-900">
        {/* Navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <nav className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/SolAudioLogo.png"
                        alt="SolAudio Logo"
                        width={40}
                        height={40}
                        className="mr-2"
                    />
                    <span className="text-2xl font-bold text-[#9945FF] dark:text-[#14F195]">
                                SolAudio
                            </span>
                </Link>

                {/* Hamburger Menu for Mobile */}
                <button
                    className="block md:hidden text-gray-700 dark:text-gray-200 focus:outline-none"
                    onClick={toggleMenu}
                >
                    {/* Hamburger Icon */}
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {menuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>

                {/* Navigation Links (Desktop and Mobile) */}
                <div
                    className={`${
                        menuOpen ? 'block' : 'hidden'
                    } absolute top-full left-0 w-full bg-white dark:bg-gray-800 md:block md:static md:w-auto`}
                >
                    <div className="space-y-2 md:space-y-0 md:space-x-6 flex flex-col md:flex-row items-center p-4 md:p-0">
                        <Link
                            href="/"
                            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FaHome className="mr-2" /> Home
                        </Link>
                        <Link
                            href="/radio"
                            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            <MdRadio className="mr-2" /> Radio
                        </Link>
                        <Link
                            href="/about"
                            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FaInfoCircle className="mr-2" /> About
                        </Link>
                        <Link
                            href="/contact"
                            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FaEnvelope className="mr-2" /> Contact
                        </Link>
                    </div>
                </div>
            </nav>
        </header>

        {/* Main Content */}
        <main>{children}</main>
        </body>
        </html>
    );
}