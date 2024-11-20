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

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch("https://de1.api.radio-browser.info/json/countries");

                if (!response.ok) {
                    throw new Error("Failed to fetch countries");
                }

                const data: Country[] = await response.json();
                setCountries(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

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

    return (
        <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    Explore Radio Stations by Country
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Select a country to explore its available radio stations.
                </p>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {countries.map((country) => (
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