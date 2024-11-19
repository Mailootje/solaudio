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

          {/* Roadmap */}
          <section className="row-start-2 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg rounded-lg p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-semibold text-center text-indigo-600 dark:text-indigo-400 mb-8">
                  🚀 Roadmap to Launch
              </h2>
              <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                          1
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Research & Planning</h3>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                              Conduct market research on global radio stations and cryptocurrency integration. Define your unique value proposition and target audience. Outline features like radio station integration, crypto wallet connections, and music streaming.
                          </p>
                      </div>
                  </div>
                  {/* Step 2 */}
                  <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                          2
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Design & Branding</h3>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                              Develop a striking brand identity for SolAudio, complete with logos, color schemes, and typography. Design user-friendly interfaces focusing on smooth navigation and an engaging user experience.
                          </p>
                      </div>
                  </div>
                  {/* Step 3 */}
                  <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                          3
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Development</h3>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                              Build the platform using a secure and scalable tech stack. Integrate APIs for music streaming and implement a robust cryptocurrency wallet system for investments and trading.
                          </p>
                      </div>
                  </div>
                  {/* Step 4 */}
                  <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                          4
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Content & Partnerships</h3>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                              Curate a rich library of diverse radio stations for all audiences. Collaborate with partners to broaden the content base and create value-driven alliances.
                          </p>
                      </div>
                  </div>
                  {/* Step 5 */}
                  <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                          5
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Launch & Marketing</h3>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                              Launch the platform with a soft rollout to gather feedback. Execute strategic marketing campaigns to build awareness and attract users to the platform.
                          </p>
                      </div>
                  </div>
              </div>
          </section>

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