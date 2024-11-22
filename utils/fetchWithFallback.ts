// utils/fetchWithFallback.ts

const MAX_RETRIES = 3;

export async function fetchWithFallback<T>(
    primaryUrl: string,
    fallbackUrl: string,
    retries = MAX_RETRIES
): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(primaryUrl);

            if (response.ok) {
                return await response.json();
            } else if (response.status === 502 && fallbackUrl) {
                console.warn(`Attempt ${attempt}: Primary API failed with 502. Trying fallback API.`);
                const fallbackResponse = await fetch(fallbackUrl);
                if (fallbackResponse.ok) {
                    return await fallbackResponse.json();
                } else {
                    throw new Error(
                        `Attempt ${attempt}: Fallback API failed with status ${fallbackResponse.status}`
                    );
                }
            } else {
                throw new Error(`Attempt ${attempt}: Primary API failed with status ${response.status}`);
            }
        } catch (error) {
            if (attempt === retries) {
                throw new Error(`All ${retries} attempts failed. Last error: ${(error as Error).message}`);
            }
            // Exponential backoff delay
            const delay = Math.pow(2, attempt) * 100; // e.g., 200ms, 400ms, 800ms
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    // Fallback to secondary if all retries fail
    if (fallbackUrl) {
        try {
            const fallbackResponse = await fetch(fallbackUrl);
            if (!fallbackResponse.ok) {
                throw new Error(`Fallback API failed with status ${fallbackResponse.status}`);
            }
            return await fallbackResponse.json();
        } catch (fallbackError) {
            throw new Error(`Both primary and fallback APIs failed. Fallback error: ${(fallbackError as Error).message}`);
        }
    }

    throw new Error(`Failed to fetch data from both primary and fallback APIs.`);
}