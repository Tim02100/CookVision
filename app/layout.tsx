// app/layout.tsx
import './globals.css'; // Sicherstellen, dass globales CSS geladen wird
import { Inter } from 'next/font/google'; // Import von Schriftarten

const inter = Inter({ subsets: ['latin'] }); // Initialisierung der Schriftart

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head />
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* Navigation Bar mit animiertem Verlauf */}
        <nav className="navbar-gradient text-white p-4 shadow-md w-full">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">CookVision</h1>
            <ul className="flex space-x-6">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/about" className="hover:underline">About</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
              {/* Der "Rezept"-Link wurde entfernt */}
            </ul>
          </div>
        </nav>

        {/* Main Content mit bewegendem Hintergrund */}
        <main className="flex-grow w-full animated-gradient">
          {children}
        </main>

        {/* Footer mit animiertem Verlauf */}
        <footer className="footer-gradient text-white p-4 mt-auto w-full">
          <div className="container mx-auto text-center">
            <p>© 2024 CookVision. All rights reserved.</p>
            <p>More additional info about the website.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
