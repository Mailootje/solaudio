// app/api/validate-audio-url/route.ts

import { NextResponse } from 'next/server';
import https from 'https';
import http from 'http';
import { isURL } from 'validator';

// Configuration Constants
const MAX_REDIRECTS = 5;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500; // Initial delay in milliseconds

// In-memory cache for validated URLs
const validatedUrlCache: { [key: string]: boolean } = {};

/**
 * Helper function to pause execution for a specified duration.
 * Implements exponential backoff for retries.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Validates an audio URL by making an HTTP/HTTPS GET request.
 * Ensures the URL points to a valid and active audio stream.
 * @param url - The audio stream URL to validate.
 * @param redirectCount - Tracks the number of redirects followed.
 * @param retryCount - Tracks the number of retry attempts.
 * @returns A promise that resolves with the validated URL or rejects with an error.
 */
async function validateAudioUrl(
    url: string,
    redirectCount: number = 0,
    retryCount: number = 0
): Promise<string> {
    if (redirectCount > MAX_REDIRECTS) {
        throw new Error('Too many redirects while validating the audio URL.');
    }

    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                    'Chrome/58.0.3029.110 Safari/537.3',
                'Accept': 'audio/mpeg, audio/*; q=0.9, */*; q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
                // 'Referer': 'https://www.example.com/', // Optional: Adjust or omit
            },
        };

        const req = protocol.request(options, (res) => {
            const { statusCode, headers } = res;

            if (statusCode === 200 || statusCode === 206) { // 206 Partial Content for streams
                const contentType = headers['content-type'];
                if (contentType && contentType.startsWith('audio/')) {
                    // Read a small chunk to ensure the stream is active
                    let receivedData = false;
                    res.once('data', () => {
                        receivedData = true;
                        req.abort(); // Abort after receiving data
                        resolve(url);
                    });
                    res.on('end', () => {
                        if (!receivedData) {
                            reject(new Error('Stream ended without transmitting data.'));
                        }
                    });
                } else {
                    reject(new Error(`Invalid Content-Type: ${headers['content-type']}`));
                }
            } else if (statusCode === 301 || statusCode === 302) {
                const location = headers.location;
                if (location) {
                    const newUrl = new URL(location, url).toString();
                    validateAudioUrl(newUrl, redirectCount + 1, retryCount)
                        .then(resolve)
                        .catch(reject);
                } else {
                    reject(new Error('Redirect response received without a Location header.'));
                }
            } else if (statusCode === 400) {
                let errorData = '';
                res.on('data', (chunk) => {
                    errorData += chunk;
                });
                res.on('end', () => {
                    console.error(`Bad Request for URL: ${url}`);
                    console.error(`Response Body: ${errorData}`);
                    reject(new Error(`Bad Request: ${errorData}`));
                });
            } else if (statusCode >= 500 && statusCode < 600) {
                if (retryCount < MAX_RETRIES) {
                    console.warn(`Server error (${statusCode}) for URL: ${url}. Retrying attempt ${retryCount + 1}...`);
                    setTimeout(() => {
                        validateAudioUrl(url, redirectCount, retryCount + 1)
                            .then(resolve)
                            .catch(reject);
                    }, RETRY_DELAY_MS * Math.pow(2, retryCount)); // Exponential backoff
                } else {
                    reject(new Error(`Server error encountered: ${statusCode}`));
                }
            } else {
                let errorData = '';
                res.on('data', (chunk) => {
                    errorData += chunk;
                });
                res.on('end', () => {
                    console.error(`Unexpected response for URL: ${url}`);
                    console.error(`Status: ${statusCode}`);
                    console.error(`Response Body: ${errorData}`);
                    reject(new Error(`Unexpected response status: ${statusCode}. Details: ${errorData}`));
                });
            }
        });

        req.on('error', (e) => {
            if (retryCount < MAX_RETRIES) {
                console.warn(`Network error for URL: ${url}. Retrying attempt ${retryCount + 1}...`);
                setTimeout(() => {
                    validateAudioUrl(url, redirectCount, retryCount + 1)
                        .then(resolve)
                        .catch(reject);
                }, RETRY_DELAY_MS * Math.pow(2, retryCount)); // Exponential backoff
            } else {
                reject(new Error(`Network error: ${e.message}`));
            }
        });

        req.setTimeout(10000, () => { // 10 seconds timeout
            req.abort();
            reject(new Error('Request timed out while validating the audio URL.'));
        });

        req.end();
    });
}

/**
 * Handles GET requests to validate audio URLs.
 * @param request - The incoming Request object.
 * @returns A JSON response with the validated URL or an error message.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json(
            { error: 'Invalid or missing URL parameter.' },
            { status: 400 }
        );
    }

    // Validate URL format to prevent SSRF
    if (!isURL(url, { require_protocol: true, protocols: ['http', 'https'] })) {
        return NextResponse.json(
            { error: 'Invalid URL format.' },
            { status: 400 }
        );
    }

    // Check if the URL is already validated and cached
    if (validatedUrlCache[url]) {
        return NextResponse.json({ url });
    }

    try {
        const finalUrl = await validateAudioUrl(url);
        validatedUrlCache[url] = true; // Cache the validated URL
        return NextResponse.json({ url: finalUrl });
    } catch (error: any) {
        console.error('Error validating audio URL:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to validate the audio URL.' },
            { status: 500 }
        );
    }
}