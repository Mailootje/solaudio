// Inside fetchWithFallback.ts

export async function fetchWithFallback<T>(
    primaryUrl: string,
    fallbackUrl: string,
    options?: RequestInit,
    retries: number = 3,
    backoff: number = 300
): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Attempt ${attempt}: Fetching primary API: ${primaryUrl}`);
            const response = await fetch(primaryUrl, options);
            if (response.ok) {
                console.log(`Primary API succeeded on attempt ${attempt}.`);
                return (await response.json()) as T;
            } else if (response.status === 502) {
                console.warn(`Primary API failed with 502 on attempt ${attempt}.`);
            } else {
                throw new Error(`Primary API failed with status ${response.status}`);
            }
        } catch (error) {
            console.error(`Attempt ${attempt} to primary API failed: ${(error as Error).message}`);
        }

        // Exponential Backoff before next retry
        const delay = backoff * Math.pow(2, attempt - 1);
        console.log(`Waiting for ${delay}ms before next attempt.`);
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // After retries, attempt fallback
    console.warn(`All ${retries} attempts to primary API failed. Trying fallback API: ${fallbackUrl}`);

    try {
        console.log(`Fetching fallback API: ${fallbackUrl}`);
        const fallbackResponse = await fetch(fallbackUrl);
        if (!fallbackResponse.ok) {
            throw new Error(`Fallback API failed with status ${fallbackResponse.status}`);
        }
        console.log(`Fallback API succeeded.`);
        return (await fallbackResponse.json()) as T;
    } catch (fallbackError) {
        console.error(`Fallback API failed: ${(fallbackError as Error).message}`);
        throw new Error(
            `Both primary and fallback APIs failed. Primary attempts: ${retries}, Fallback error: ${(fallbackError as Error).message}`
        );
    }
}