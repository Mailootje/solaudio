"use client";

import { useEffect, useState, useRef } from "react";
import { fetchWithFallback } from "@/utils/fetchWithFallback"; // Adjust the path as necessary
import { generateApiUrls } from "@/utils/apiUrls";

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
    const [audioUrl, setAudioUrl] = useState<string>(""); // Validated Audio URL
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const maxRedirects = 5; // For additional client-side control if needed

    // Function to validate and fetch the audio URL via the API route
    const fetchValidatedAudioUrl = async (url: string): Promise<string> => {
        const response = await fetch(`/api/validate-audio-url?url=${encodeURIComponent(url)}`);
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
            // Attempt to parse error message
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to validate audio URL.');
            } else {
                // Fallback error message
                throw new Error(`Failed to validate audio URL. Status: ${response.status}`);
            }
        }
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.url) {
                return data.url;
            } else {
                throw new Error('Invalid response from server.');
            }
        } else {
            throw new Error('Expected JSON response from server.');
        }
    };

    // Function to fetch station details and validate audio URL
    const fetchStationDetails = async () => {
        setLoading(true);
        setError(null);
        setAudioUrl("");

        try {
            const data: Station[] = await fetchWithFallback<Station[]>(
                generateApiUrls("/json/stations/byuuid/", `${stationuuid}`)
            );

            if (data.length > 0) {
                const fetchedStation = data[0];
                setStation(fetchedStation);

                // Validate the audio URL via the API route
                const validUrl = await fetchValidatedAudioUrl(fetchedStation.url);
                setAudioUrl(validUrl);
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

    useEffect(() => {
        fetchStationDetails();
    }, [stationuuid]);

    // Set the document title when station data is available
    useEffect(() => {
        if (station) {
            document.title = `${station.name} - ${country}`;
        } else {
            document.title = "SolAudio.io";
        }

        // Optional: Cleanup to reset title when component unmounts
        return () => {
            document.title = "SolAudio.io";
        };
    }, [station]);

    // Handle audio playback errors
    const handleAudioError = async () => {
        if (!station) return;

        setError("Failed to play audio. Attempting to fetch a new URL...");
        try {
            const validUrl = await fetchValidatedAudioUrl(station.url);
            setAudioUrl(validUrl);
            setError(null);
            audioRef.current?.play();
        } catch (err) {
            if (err instanceof Error) {
                setError(`Error fetching audio: ${err.message}`);
            } else {
                setError("An unknown error occurred while fetching audio.");
            }
        }
    };

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
                {audioUrl ? (
                    <audio
                        ref={audioRef}
                        controls
                        className="w-full max-w-md mt-4"
                        src={audioUrl}
                        crossOrigin="anonymous"
                        onError={handleAudioError}
                    ></audio>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 mt-4">
                        Loading audio...
                    </p>
                )}

                <canvas
                    ref={canvasRef}
                    className="w-full max-w-3xl mt-4 h-40 sm:h-60 rounded-lg bg-black bg-opacity-50"
                ></canvas>
            </div>
        </div>
    );
}
