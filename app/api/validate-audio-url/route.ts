// app/api/validate-audio-url/route.ts

import { NextResponse } from 'next/server';

// Constants for configuration
const MAX_REDIRECTS = 5;
const MAX_RETRIES = 3; // Max retries for validation
const RETRY_DELAY_MS = 500; // Delay between retries in milliseconds

/**
 * Helper function to pause execution
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Validates the provided audio URL by following redirects manually.
 * Implements a retry mechanism for transient errors.
 * @param url - The audio stream URL to validate.
 * @param redirectCount - Current redirect count to prevent infinite loops.
 * @param retryCount - Current retry attempt count.
 * @returns The final validated URL.
 */
async function validateAudioUrl(
    url: string,
    redirectCount: number = 0,
    retryCount: number = 0
): Promise<string> {
    if (redirectCount > MAX_REDIRECTS) {
        throw new Error('Too many redirects while validating the audio URL.');
    }

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'manual', // Prevent automatic redirects
        });

        if (response.status === 200) {
            return url;
        } else if (response.status === 301 || response.status === 302) {
            const location = response.headers.get('Location');
            if (location) {
                const newUrl = new URL(location, url).toString();
                return await validateAudioUrl(newUrl, redirectCount + 1, retryCount);
            } else {
                throw new Error('Redirect response received without a Location header.');
            }
        } else if (response.status >= 500 && response.status < 600) {
            // Retry for server errors
            if (retryCount < MAX_RETRIES) {
                await sleep(RETRY_DELAY_MS * Math.pow(2, retryCount)); // Exponential backoff
                return await validateAudioUrl(url, redirectCount, retryCount + 1);
            }
            throw new Error(`Server error encountered: ${response.status}`);
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error: any) {
        // Retry for network-related errors
        if (retryCount < MAX_RETRIES) {
            await sleep(RETRY_DELAY_MS * Math.pow(2, retryCount)); // Exponential backoff
            return await validateAudioUrl(url, redirectCount, retryCount + 1);
        }
        if (error.name === 'FetchError') {
            throw new Error('Network error: Failed to fetch the provided URL.');
        }
        throw error;
    }
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

    try {
        const finalUrl = await validateAudioUrl(url);
        return NextResponse.json({ url: finalUrl });
    } catch (error: any) {
        // Optionally log the error here for server monitoring
        console.error('Error validating audio URL:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to validate the audio URL.' },
            { status: 500 }
        );
    }
}
