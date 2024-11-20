export const metadata = {
    title: 'SolAudio',
    description: 'Explore radio stations worldwide',
    icons: {
        icon: [
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
            { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
            { rel: 'icon', href: '/favicon.ico' },
        ],
        apple: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        manifest: '/site.webmanifest',
    },
};

export default function ServerLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
