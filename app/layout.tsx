"use client";

import './globals.css'; // Import global styles
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa'; // Import FontAwesome icons
import { MdRadio } from 'react-icons/md'; // Import Material Design icon for Radio
import { useState, useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);

    // Prevent scrolling when the menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <html lang="en">
        <body className="bg-gray-50 dark:bg-gray-900">
        {/* Navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50">
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

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-6">
                    <Link
                        href="/"
                        className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                    >
                        <FaHome className="mr-1" /> Home
                    </Link>
                    <Link
                        href="/radio"
                        className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                    >
                        <MdRadio className="mr-1" /> Radio
                    </Link>
                    <Link
                        href="/about"
                        className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                    >
                        <FaInfoCircle className="mr-1" /> About
                    </Link>
                    <Link
                        href="/contact"
                        className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                    >
                        <FaEnvelope className="mr-1" /> Contact
                    </Link>
                </div>

                {/* Hamburger Menu for Mobile */}
                <button
                    className="block md:hidden relative w-8 h-8 focus:outline-none z-50"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                    aria-expanded={menuOpen}
                >
                    {/* Hamburger Icon */}
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-current transition duration-300 ease-in-out ${menuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></div>
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-current transition duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-current transition duration-300 ease-in-out ${menuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></div>
                </button>
            </nav>
        </header>

        {/* Overlay */}
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out z-40 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            onClick={toggleMenu}
            aria-hidden={!menuOpen}
        ></div>

        {/* Slide-in Menu */}
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
                menuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <nav className="mt-16 px-6">
                <ul className="space-y-6">
                    <li>
                        <Link
                            href="/"
                            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FaHome className="mr-3" size={20} /> Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/radio"
                            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            <MdRadio className="mr-3" size={20} /> Radio
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/about"
                            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FaInfoCircle className="mr-3" size={20} /> About
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/contact"
                            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-[#9945FF] dark:hover:text-[#14F195] font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FaEnvelope className="mr-3" size={20} /> Contact
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>

        {/* Main Content */}
        <main className="pt-20">{children}</main>
        </body>
        </html>
    );
}