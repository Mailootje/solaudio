// utils/fetchWithFallback.ts

export async function fetchWithFallback<T>(
    urls: string[],
    options?: RequestInit,
    retries: number = 3,
    backoff: number = 300
): Promise<T> {
    for (const [index, url] of urls.entries()) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`Attempt ${attempt} for API ${index + 1}: ${url}`);
                const response = await fetch(url, options);
                if (response.ok) {
                    console.log(`API ${index + 1} succeeded on attempt ${attempt}.`);
                    return (await response.json()) as T;
                } else if (response.status === 502) {
                    console.warn(`API ${index + 1} failed with 502 on attempt ${attempt}.`);
                } else {
                    throw new Error(`API ${index + 1} failed with status ${response.status}`);
                }
            } catch (error) {
                console.error(`Attempt ${attempt} for API ${index + 1} failed: ${(error as Error).message}`);
            }

            // Exponential Backoff before next retry
            const delay = backoff * Math.pow(2, attempt - 1);
            console.log(`Waiting for ${delay}ms before next attempt.`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        console.warn(`All ${retries} attempts for API ${index + 1} failed.`);
    }

    // If all APIs fail, throw an error
    throw new Error(
        `All ${urls.length} APIs failed after ${retries} attempts each.`
    );
}