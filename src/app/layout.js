import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Layout } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mojo assignment",
  description: "mojo assignment fb authentication",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-50">
          {/* <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Layout className="w-8 h-8 text-blue-600" />
                  <span className="ml-2 text-xl font-semibold text-gray-900">
                    FB Insights Dashboard
                  </span>
                </div>
              </div>
            </div>
          </nav> */}

          <main className="">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
