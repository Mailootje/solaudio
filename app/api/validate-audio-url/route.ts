// app/api/validate-audio-url/route.ts

import { NextResponse } from 'next/server';

const MAX_REDIRECTS = 5;
const cache = new Map<string, string>();

async function validateAudioUrl(url: string, redirectCount: number = 0): Promise<string> {
    if (redirectCount > MAX_REDIRECTS) {
        throw new Error('Too many redirects.');
    }

    if (cache.has(url)) {
        return cache.get(url)!;
    }

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'manual', // Prevent automatic redirects
        });

        if (response.status === 200) {
            cache.set(url, url);
            return url;
        } else if (response.status === 301 || response.status === 302) {
            const location = response.headers.get('Location');
            if (location) {
                const newUrl = new URL(location, url).toString();
                const finalUrl = await validateAudioUrl(newUrl, redirectCount + 1);
                cache.set(url, finalUrl);
                return finalUrl;
            } else {
                throw new Error('Redirect response without Location header.');
            }
        } else if (response.status >= 500 && response.status < 600) {
            throw new Error(`Server error: ${response.status}`);
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error: any) {
        if (error.name === 'FetchError') {
            throw new Error('Failed to fetch the URL.');
        }
        throw error;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Invalid or missing URL parameter.' }, { status: 400 });
    }

    try {
        const finalUrl = await validateAudioUrl(url);
        return NextResponse.json({ url: finalUrl });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to validate URL.' }, { status: 500 });
    }
}
