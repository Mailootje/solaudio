import CountryRadioPage from "./CountryRadioPage";

// Define the dynamic route's static params
export async function generateStaticParams() {
    // Replace with actual API or data fetching logic if needed
    return [{ country: "Andorra" }, { country: "Netherlands" }]; // Example countries
}

export default async function Page({ params }: { params: { country: string } }) {
    const country = decodeURIComponent(params.country);

    if (!country) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-500">Invalid country parameter.</p>
            </div>
        );
    }

    return <CountryRadioPage country={country} />;
}
