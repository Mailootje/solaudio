import CountryRadioPage from "./CountryRadioPage";

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
    // Await and resolve `params` as it is a Promise
    const resolvedParams = await params;
    const country = decodeURIComponent(resolvedParams.country);

    if (!country) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-500">Invalid country parameter.</p>
            </div>
        );
    }

    return <CountryRadioPage country={country} />;
}