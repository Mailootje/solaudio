import './globals.css'; // Import global styles
import Link from 'next/link';

export const metadata = {
  title: 'SolAudio',
  description: 'Explore radio stations worldwide',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-900 shadow-md">
        <nav className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            SolAudio
          </Link>
          <div className="space-x-4">
            <Link href="/radio" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              Radio
            </Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              Contact
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">{children}</main>
      </body>
      </html>
  );
}