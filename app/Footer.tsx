"use client";

import { useState, useEffect } from 'react';

export default function Footer() {
    const [currentYear, setCurrentYear] = useState("");

    useEffect(() => {
        setCurrentYear(new Date().getFullYear().toString());
    }, []);

    return (
        <footer className="text-center text-gray-700 dark:text-gray-300 mt-10">
            <p>© {currentYear} SolAudio. All rights reserved.</p>
        </footer>
    );
}