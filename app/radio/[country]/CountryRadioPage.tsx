"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchWithFallback } from "@/utils/fetchWithFallback"; // Adjust the path as necessary

type Station = {
    stationuuid: string;
    name: string;
    bitrate: number;
    url: string;
};

export default function CountryRadioPage({ country }: { country: string }) {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const stationsPerPage = 16;
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchStations = async () => {
            setLoading(true);

            try {
                const data: Station[] = await fetchWithFallback(
                    `https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(
                        country
                    )}`,
                    `https://at1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(
                        country
                    )}`
                );

                setStations(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Failed to fetch stations. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStations();
    }, [country]);

    // Filter stations based on search query
    const filteredStations = stations.filter((station) =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Adjust pagination based on filtered stations
    const totalPages = Math.ceil(filteredStations.length / stationsPerPage);
    const indexOfLastStation = currentPage * stationsPerPage;
    const indexOfFirstStation = indexOfLastStation - stationsPerPage;
    const currentStations = filteredStations.slice(indexOfFirstStation, indexOfLastStation);

    // Reset currentPage if it exceeds totalPages after filtering
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages > 0 ? totalPages : 1);
        }
    }, [currentPage, totalPages]);

    if (loading) {
        return <p>Loading stations...</p>;
    }

    if (error) {
        return <p className="text-lg text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    Radio Stations in {country}
                </h1>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter stations..."
                    className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentStations.map((station) => (
                    <div
                        key={station.stationuuid}
                        className="p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 cursor-pointer"
                        onClick={() => router.push(`/radio/${country}/${station.stationuuid}`)}
                    >
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {station.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Bitrate: {station.bitrate} kbps
                        </p>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded bg-indigo-500 text-white font-semibold disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded bg-indigo-500 text-white font-semibold disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}