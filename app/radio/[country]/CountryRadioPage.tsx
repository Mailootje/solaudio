"use client";

import { useEffect, useState } from "react";

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

    useEffect(() => {
        const fetchStations = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    `https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(
                        country
                    )}`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch stations for ${country}.`);
                }

                const data: Station[] = await response.json();
                setStations(data);
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

        fetchStations();
    }, [country]);

    const totalPages = Math.ceil(stations.length / stationsPerPage);
    const indexOfLastStation = currentPage * stationsPerPage;
    const indexOfFirstStation = indexOfLastStation - stationsPerPage;
    const currentStations = stations.slice(indexOfFirstStation, indexOfLastStation);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <p className="text-lg text-gray-600 dark:text-gray-400">Loading stations...</p>
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

    if (!stations.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    No stations found for {country}.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    Radio Stations in {country}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Showing {stations.length} stations in {country}.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentStations.map((station) => (
                    <div
                        key={station.stationuuid}
                        className="p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {station.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Bitrate: {station.bitrate} kbps
                        </p>
                        <audio controls className="w-full mt-2">
                            <source src={station.url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center items-center gap-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded bg-indigo-500 text-white font-semibold disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-700 dark:text-gray-300">
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
        </div>
    );
}