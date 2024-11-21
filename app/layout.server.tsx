// app/layout.server.tsx

export const metadata = {
    title: 'SolAudio | Explore Radio Stations Worldwide',
    description: 'SolAudio allows you to explore and listen to radio stations from around the globe. Discover new music, genres, and stations effortlessly.',
    keywords: ['Radio', 'Music', 'Streaming', 'Online Radio', 'SolAudio', 'Global Radio Stations', 'Listen Live'],
    viewport: 'width=device-width, initial-scale=1',

    icons: {
        icon: [
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
            { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
            { rel: 'icon', href: '/favicon.ico' },
        ],
        apple: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        manifest: '/site.webmanifest',
    },

    openGraph: {
        title: 'SolAudio | Explore Radio Stations Worldwide',
        description: 'SolAudio allows you to explore and listen to radio stations from around the globe. Discover new music, genres, and stations effortlessly.',
        url: 'https://www.solaudio.com', // Replace with your actual URL
        siteName: 'SolAudio',
        images: [
            {
                url: 'https://www.solaudio.com/SolAudio.png', // Replace with your actual image URL
                width: 1200,
                height: 630,
                alt: 'SolAudio Logo',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        title: 'SolAudio | Explore Radio Stations Worldwide',
        description: 'SolAudio allows you to explore and listen to radio stations from around the globe. Discover new music, genres, and stations effortlessly.',
        images: ['https://www.solaudio.com/twitter-image.jpg'], // Replace with your actual image URL
        site: '@SolAudio', // Replace with your Twitter handle
        creator: '@SolAudio', // Replace with the creator's Twitter handle if different
    },

    robots: 'index, follow',
};

export default function ServerLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}