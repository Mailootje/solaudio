import Image from "next/image";

export default function Home() {
  return (
      <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="row-start-1 text-center">
          <Image
              src="/SolAudio.png"
              alt="SolAudio Logo"
              width={1125}
              height={156}
              className="mx-auto"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mt-4">
            Welcome to <span className="text-indigo-600 dark:text-indigo-400">SolAudio</span>!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Your hub for audio innovation and creativity.
          </p>
        </header>

        {/* Footer */}
        <footer className="row-start-3 text-center text-gray-600 dark:text-gray-400">
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 justify-center"
              href="https://solaudio.io"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                src="/globe.svg"
                alt="Globe icon"
                width={16}
                height={16}
                className="dark:invert"
            />
            Visit SolAudio.io →
          </a>
          <p className="text-xs mt-2">
            © {new Date().getFullYear()} SolAudio. All rights reserved.
          </p>
        </footer>
      </div>
  );
}