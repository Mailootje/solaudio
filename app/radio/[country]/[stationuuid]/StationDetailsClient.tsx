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
    const [stationError, setStationError] = useState<string | null>(null); // Error related to fetching station details
    const [validationError, setValidationError] = useState<string | null>(null); // Error related to URL validation
    const [playbackError, setPlaybackError] = useState<string | null>(null); // Error related to audio playback
    const [audioUrl, setAudioUrl] = useState<string>(""); // Validated Audio URL
    const [audioRetryCount, setAudioRetryCount] = useState<number>(0); // Tracks audio playback retries
    const [isRetrying, setIsRetrying] = useState<boolean>(false); // Prevents concurrent retries
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Configuration for retries
    const MAX_URL_VALIDATION_RETRIES = 3; // Max retries for URL validation
    const MAX_AUDIO_RETRIES = 3; // Max retries for audio playback errors
    const RETRY_DELAY_MS = 500; // 500ms delay between retries

    // Helper function to pause execution for a specified duration
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    /**
     * Validates and fetches the audio URL via the API route with retries.
     * @param url - The original audio stream URL.
     * @param retryCount - Current retry attempt for URL validation.
     * @returns The validated audio URL.
     */
    const fetchValidatedAudioUrl = async (url: string, retryCount = 0): Promise<string> => {
        try {
            const response = await fetch(`/api/validate-audio-url?url=${encodeURIComponent(url)}`);
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                // Attempt to parse error message from JSON response
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    throw new Error(data.error || "Failed to validate audio URL.");
                } else {
                    // Fallback error message for non-JSON responses
                    throw new Error(`Failed to validate audio URL. Status: ${response.status}`);
                }
            }

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (data.url) {
                    return data.url;
                } else {
                    throw new Error("Invalid response from server.");
                }
            } else {
                throw new Error("Expected JSON response from server.");
            }
        } catch (err: any) {
            if (retryCount < MAX_URL_VALIDATION_RETRIES) {
                // 500ms delay before retrying
                await sleep(RETRY_DELAY_MS);
                return await fetchValidatedAudioUrl(url, retryCount + 1);
            } else {
                throw err;
            }
        }
    };

    /**
     * Fetches station details and validates the audio URL.
     * Resets audio retry count upon successful validation.
     */
    const fetchStationDetails = async () => {
        setLoading(true);
        setStationError(null); // Reset station error
        setValidationError(null); // Reset validation error
        setPlaybackError(null); // Reset playback error
        setAudioUrl("");
        setAudioRetryCount(0); // Reset audio retry count on new fetch

        try {
            const data: Station[] = await fetchWithFallback<Station[]>(
                generateApiUrls("/json/stations/byuuid/", `${stationuuid}`)
            );

            if (data.length > 0) {
                const fetchedStation = data[0];
                setStation(fetchedStation);

                // Validate the audio URL via the API route with retries
                const validUrl = await fetchValidatedAudioUrl(fetchedStation.url);
                setAudioUrl(validUrl);
            } else {
                throw new Error("No station details found.");
            }
        } catch (err: any) {
            if (err instanceof Error) {
                // Distinguish between validation errors and station fetching errors
                if (err.message.includes("validate")) {
                    setValidationError(err.message);
                } else {
                    setStationError(err.message);
                }
            } else {
                setStationError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStationDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stationuuid]);

    // Set the document title when station data is available
    useEffect(() => {
        if (station) {
            document.title = `${station.name} - ${country}`;
        } else {
            document.title = "SolAudio.io";
        }

        // Cleanup to reset title when component unmounts
        return () => {
            document.title = "SolAudio.io";
        };
    }, [station, country]);

    /**
     * Handles audio playback errors by attempting to fetch a new URL.
     * Limits the number of retry attempts to prevent infinite loops.
     */
    const handleAudioError = async () => {
        if (!station) return;

        if (audioRetryCount >= MAX_AUDIO_RETRIES || isRetrying) {
            setPlaybackError("Failed to play audio after multiple attempts.");
            return;
        }

        setIsRetrying(true);
        setPlaybackError(`Failed to play audio. Attempting to fetch a new URL... (Attempt ${audioRetryCount + 1} of ${MAX_AUDIO_RETRIES})`);
        setAudioRetryCount((prev) => prev + 1);

        try {
            const validUrl = await fetchValidatedAudioUrl(station.url);
            setAudioUrl(validUrl);
            setPlaybackError(null);
            audioRef.current?.play();
        } catch (err: any) {
            if (err instanceof Error) {
                setPlaybackError(`Error fetching audio: ${err.message}`);
            } else {
                setPlaybackError("An unknown error occurred while fetching audio.");
            }
        } finally {
            setIsRetrying(false);
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Loading station...
                </p>
            </div>
        );
    }

    // Render station fetching errors
    if (stationError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <p className="text-lg text-red-500">{stationError}</p>
            </div>
        );
    }

    // Render validation errors
    if (validationError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <p className="text-lg text-red-500">{validationError}</p>
            </div>
        );
    }

    // Render message if station is not found
    if (!station) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Station details could not be loaded.
                </p>
            </div>
        );
    }

    // Render main UI with playback errors displayed above the audio player
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
                {/* Display validation error above the audio player */}
                {validationError && (
                    <p className="text-lg text-red-500 mb-2">
                        {validationError}
                    </p>
                )}

                {/* Display playback error above the audio player */}
                {playbackError && (
                    <p className="text-lg text-red-500 mb-2">
                        {playbackError}
                    </p>
                )}

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
