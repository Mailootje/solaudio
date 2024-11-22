"use client";

import { useEffect, useState, useRef } from "react";
import { fetchWithFallback } from "@/utils/fetchWithFallback"; // Adjust the import path as necessary

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

    // Audio Equalizer Visualization
    useEffect(() => {
        if (station && audioRef.current && canvasRef.current) {
            const audioElement = audioRef.current;

            // Set crossOrigin to allow CORS
            audioElement.crossOrigin = "anonymous";

            // Initialize Web Audio API context
            const audioContext = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaElementSource(audioElement);
            const analyser = audioContext.createAnalyser();

            // Connect nodes
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            // Handle AudioContext suspension
            const handlePlay = async () => {
                if (audioContext.state === "suspended") {
                    await audioContext.resume();
                }
            };

            audioElement.addEventListener("play", handlePlay);

            // Set up the canvas visualization
            const canvas = canvasRef.current;
            const canvasContext = canvas.getContext("2d");

            if (canvasContext) {
                analyser.fftSize = 512; // Increased for better resolution
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                // Resize canvas to be responsive
                const resizeCanvas = () => {
                    canvas.width = canvas.clientWidth;
                    canvas.height = canvas.clientHeight;
                };

                resizeCanvas();
                window.addEventListener("resize", resizeCanvas);

                const draw = () => {
                    requestAnimationFrame(draw);

                    analyser.getByteFrequencyData(dataArray);

                    // Clear the canvas with a semi-transparent background for trail effect
                    canvasContext.fillStyle = "rgba(0, 0, 0, 0.2)";
                    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

                    const barWidth = (canvas.width / bufferLength) * 1.5;
                    let x = 0;

                    for (let i = 0; i < bufferLength; i++) {
                        const barHeight = dataArray[i] / 2; // Scale down for better fit

                        // Create a dynamic gradient for each bar
                        const gradient = canvasContext.createLinearGradient(
                            x,
                            canvas.height,
                            x,
                            canvas.height - barHeight
                        );
                        gradient.addColorStop(0, `rgba(255, 0, 150, 1)`); // Pink
                        gradient.addColorStop(0.5, `rgba(0, 204, 255, 1)`); // Blue
                        gradient.addColorStop(1, `rgba(0, 255, 0, 1)`); // Green

                        canvasContext.fillStyle = gradient;
                        canvasContext.fillRect(
                            x,
                            canvas.height - barHeight,
                            barWidth - 2, // Subtracting for spacing
                            barHeight
                        );

                        x += barWidth;
                    }
                };

                draw();

                // Clean up on unmount
                return () => {
                    audioElement.removeEventListener("play", handlePlay);
                    audioContext.close();
                    window.removeEventListener("resize", resizeCanvas);
                };
            }
        }
    }, [station]);

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