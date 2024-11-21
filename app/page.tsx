"use client";

import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="text-center py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-8">
                    <Image
                        src="/SolAudio.png"
                        alt="SolAudio Logo"
                        width={200}
                        height={200}
                        className="mx-auto mb-6"
                    />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
                        Welcome to <span className="text-[#9945FF]">SolAudio</span>!
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8">
                        Your hub for audio innovation and creativity.
                    </p>
                    <a
                        href="#roadmap"
                        className="inline-block bg-[#14F195] text-gray-900 font-semibold px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition duration-300"
                    >
                        Explore Our Roadmap
                    </a>
                </div>
            </header>

            {/* Roadmap */}
            <section id="roadmap" className="flex-grow container mx-auto p-8 sm:p-12">
                <h2 className="text-3xl sm:text-4xl font-semibold text-center text-[#9945FF] mb-12">
                    🚀 Roadmap to Launch
                </h2>
                <div className="relative">
                    <div className="absolute left-6 top-0 w-1 bg-[#9945FF] h-full"></div>
                    <div className="space-y-12">
                        {/* Steps */}
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="flex items-start gap-6">
                                <div className="relative z-10">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#9945FF] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                        {[
                                            "Research & Planning",
                                            "Design & Branding",
                                            "Development",
                                            "Content & Partnerships",
                                            "Launch & Marketing",
                                        ][index]}
                                    </h3>
                                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {[
                                            "Conduct market research on global radio stations and cryptocurrency integration. Define your unique value proposition and target audience. Outline features like radio station integration, crypto wallet connections, and music streaming.",
                                            "Develop a striking brand identity for SolAudio, complete with logos, color schemes, and typography. Design user-friendly interfaces focusing on smooth navigation and an engaging user experience.",
                                            "Build the platform using a secure and scalable tech stack. Integrate APIs for music streaming and implement a robust cryptocurrency wallet system for investments and trading.",
                                            "Curate a rich library of diverse radio stations for all audiences. Collaborate with partners to broaden the content base and create value-driven alliances.",
                                            "Launch the platform with a soft rollout to gather feedback. Execute strategic marketing campaigns to build awareness and attract users to the platform.",
                                        ][index]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-center sm:text-left mb-4 sm:mb-0">
                            <Image
                                src="/SolAudio.png"
                                alt="SolAudio Logo"
                                width={150}
                                height={150}
                                className="mx-auto sm:mx-0 mb-4"
                            />
                            <p className="text-gray-600 dark:text-gray-400">
                                © {new Date().getFullYear()} SolAudio. All rights reserved.
                            </p>
                        </div>
                        <div className="flex space-x-6">
                            <a
                                href="https://solaudio.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-[#9945FF] transition duration-300"
                            >
                                <Image
                                    src="/globe.svg"
                                    alt="Website"
                                    width={24}
                                    height={24}
                                    className="mx-auto"
                                />
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 dark:text-gray-400 hover:text-[#9945FF] transition duration-300"
                            >
                                <Image
                                    src="/X.svg"
                                    alt="X"
                                    width={24}
                                    height={24}
                                    className="mx-auto"
                                />
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 dark:text-gray-400 hover:text-[#9945FF] transition duration-300"
                            >
                                <Image
                                    src="/facebook.svg"
                                    alt="Facebook"
                                    width={24}
                                    height={24}
                                    className="mx-auto"
                                />
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 dark:text-gray-400 hover:text-[#9945FF] transition duration-300"
                            >
                                <Image
                                    src="/instagram.svg"
                                    alt="Instagram"
                                    width={24}
                                    height={24}
                                    className="mx-auto"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}