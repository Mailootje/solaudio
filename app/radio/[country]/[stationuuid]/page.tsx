import StationDetailsClient from "./StationDetailsClient";

type PageProps = {
    params: Promise<{ country: string; stationuuid: string }>;
};

export default async function Page({ params }: PageProps) {
    // Await and resolve `params` as it is a Promise
    const resolvedParams = await params;
    const country = decodeURIComponent(resolvedParams.country);
    const stationuuid = resolvedParams.stationuuid;

    if (!country || !stationuuid) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-500">Invalid parameters.</p>
            </div>
        );
    }

    return <StationDetailsClient country={country} stationuuid={stationuuid} />;
}