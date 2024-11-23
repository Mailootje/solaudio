"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithFallback } from "@/utils/fetchWithFallback"; // Adjust the path as necessary
import { generateApiUrls } from "@/utils/apiUrls";

type Country = {
    name: string;
    stationcount: number;
    brokencount: number; // New property
};

export default function RadioPage() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setIsHydrated(true);

        const fetchCountriesAndBrokenStations = async () => {
            try {
                // Fetch countries
                const countriesData: Country[] = await fetchWithFallback<Country[]>(
                    generateApiUrls("/json/countries")
                );

                // Remove duplicates and keep the one with the highest stationcount
                const uniqueCountriesMap = new Map<string, Country>();

                countriesData.forEach((country) => {
                    const existingCountry = uniqueCountriesMap.get(country.name);
                    if (!existingCountry || country.stationcount > existingCountry.stationcount) {
                        uniqueCountriesMap.set(country.name, country);
                    }
                });

                const uniqueCountries = Array.from(uniqueCountriesMap.values());

                // Sort countries alphabetically
                uniqueCountries.sort((a, b) => a.name.localeCompare(b.name));

                // Fetch broken stations
                const brokenStations: { country: string }[] = await fetchWithFallback<{ country: string }[]>(
                    generateApiUrls("/json/stations/broken")
                );

                // Calculate broken counts per country
                const brokenCountMap = new Map<string, number>();
                brokenStations.forEach((station) => {
                    const countryName = station.country;
                    if (countryName) {
                        brokenCountMap.set(
                            countryName,
                            (brokenCountMap.get(countryName) || 0) + 1
                        );
                    }
                });

                // Merge broken counts into countries data
                const countriesWithBrokenCount: Country[] = uniqueCountries.map((country) => ({
                    ...country,
                    brokencount: brokenCountMap.get(country.name) || 0,
                }));

                setCountries(countriesWithBrokenCount);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Failed to fetch data. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCountriesAndBrokenStations();
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

    // Filter countries based on search query
    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            {country.brokencount > 0 && (
                                <span className="ml-2 text-red-500">
                                    ({country.brokencount} Currently out of service)
                                </span>
                            )}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}