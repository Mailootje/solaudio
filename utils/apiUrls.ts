// utils/apiUrls.ts

export const RADIO_API_BASE_URLS = [
    "https://de1.api.radio-browser.info",
    "https://at1.api.radio-browser.info",
    "https://nl1.api.radio-browser.info" // Added third API
];

/**
 * Generates full API URLs based on the provided endpoint and parameters.
 * @param endpoint The API endpoint (e.g., "/json/countries").
 * @param params Additional parameters to include in the URL.
 * @returns An array of full URLs.
 */
export function generateApiUrls(endpoint: string, params: string = ""): string[] {
    return RADIO_API_BASE_URLS.map(baseUrl => `${baseUrl}${endpoint}${params}`);
}