"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Country = {
    name: string;
    stationcount: number;
};

export default function RadioPage() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setIsHydrated(true);

        const fetchCountries = async () => {
            try {
                const response = await fetch("https://de1.api.radio-browser.info/json/countries");
                const data: Country[] = await response.json();
                setCountries(data);
            } catch (err) {
                setError("Failed to fetch countries. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    if (!isHydrated) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <p className="text-lg text-gray-600 dark:text-gray-400">Loading countries...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }

    // Filter countries based on search query using regular expressions
    const filteredCountries = countries.filter((country) => {
        if (!searchQuery) return true; // If search query is empty, show all countries
        const regex = new RegExp(`\\b${searchQuery.toLowerCase()}`, 'i');
        return regex.test(country.name.toLowerCase());
    });

    return (
        <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    Explore Radio Stations by Country
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Select a country to explore its available radio stations.
                </p>
                {/* Search Input Field */}
                <div className="mt-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search countries..."
                        className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCountries.map((country) => (
                    <Link
                        key={country.name}
                        href={`/radio/${encodeURIComponent(country.name)}`}
                        className="group block p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-700 transition"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                            {country.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {country.stationcount} stations
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}