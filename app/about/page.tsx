export default function AboutPage() {
    return (
        <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    About SolAudio
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Learn more about our mission and goals.
                </p>
            </header>
            <section className="max-w-4xl mx-auto space-y-6 text-gray-700 dark:text-gray-300">
                <h2 className="text-2xl font-semibold">Our Mission</h2>
                <p>
                    At SolAudio, we strive to connect the world through the power of music and radio.
                    Our goal is to create a platform where users can explore radio stations from every corner of the globe.
                </p>
                <h2 className="text-2xl font-semibold">Our Vision</h2>
                <p>
                    We envision a world where audio transcends boundaries, connecting cultures, people,
                    and stories in a seamless and immersive experience.
                </p>
                <h2 className="text-2xl font-semibold">Our Team</h2>
                <p>
                    SolAudio is built by a passionate team of developers, designers, and music enthusiasts who believe in the power of audio to bring people together.
                </p>
            </section>
        </div>
    );
}
