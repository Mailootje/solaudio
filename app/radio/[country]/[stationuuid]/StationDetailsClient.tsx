"use client";

import { useEffect, useState, useRef } from "react";
import { fetchWithFallback } from "@/utils/fetchWithFallback"; // Adjust the path as necessary

type StationDetailsClientProps = {
    country: string;
    stationuuid: string;
};

type Station = {
    name: string;
    bitrate: number;
    url: string;
};

export default function StationDetailsClient({
                                                 country,
                                                 stationuuid,
                                             }: StationDetailsClientProps) {
    const [station, setStation] = useState<Station | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        const fetchStationDetails = async () => {
            setLoading(true);

            try {
                const data: Station[] = await fetchWithFallback(
                    `https://de1.api.radio-browser.info/json/stations/byuuid/${stationuuid}`,
                    `https://at1.api.radio-browser.info/json/stations/byuuid/${stationuuid}`
                );

                if (data.length > 0) {
                    setStation(data[0]); // Use the first result
                } else {
                    throw new Error("No station details found.");
                }
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

        fetchStationDetails();
    }, [stationuuid]);

    // ... (Rest of your component remains unchanged)

    // Ensure that all JSX error messages also use template literals correctly
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Loading station...
                </p>
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

    if (!station) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Station details could not be loaded.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    {station.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Located in: {country} <br />
                    Bitrate: {station.bitrate} kbps
                </p>
            </header>

            <div className="flex flex-col items-center">
                <audio
                    ref={audioRef}
                    controls
                    className="w-full max-w-md mt-4"
                    src={station.url}
                    crossOrigin="anonymous"
                ></audio>

                <canvas
                    ref={canvasRef}
                    className="w-full max-w-3xl mt-4 h-40 sm:h-60 rounded-lg bg-black bg-opacity-50"
                ></canvas>
            </div>
        </div>
    );
}
