// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserControls } from "@/components/User/UserControls";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard | Domain & Asset Management",
  description:
    "Comprehensive dashboard for managing domains and digital assets",
};

export default function RootLayout({
  children,
  domains,
  assets,
}: Readonly<{
  children: React.ReactNode;
  domains: React.ReactNode;
  assets: React.ReactNode;
}>) {
  // In a real app, this would come from your auth provider

  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}
      >
        <ToastContainer
          autoClose={5000}
          position="top-right"
          toastClassName="!bg-white !text-gray-800 !shadow-lg !rounded-xl"
          progressClassName="!bg-gradient-to-r from-[#FF9149] to-[#60B5FF]"
        />

        {/* Header with User Controls */}
        <header className="bg-gradient-to-r from-[#FF9149] to-[#FFAA6B] text-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm opacity-90 mt-1">
                Domain & Asset Management
              </p>
            </div>

            <UserControls />
          </div>
        </header>

        {/* Rest of your layout remains the same */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section
              id="domains"
              className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              aria-labelledby="domains-heading"
            >
              <div className="flex items-center mb-4">
                <div className="w-3 h-6 bg-[#FF9149] rounded-full mr-3"></div>
                <h2 id="domains-heading" className="text-xl font-semibold">
                  Domains
                </h2>
              </div>
              <div className="space-y-4">{domains}</div>
            </section>

            <section
              id="assets"
              className="lg:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              aria-labelledby="assets-heading"
            >
              <div className="flex items-center mb-4">
                <div className="w-3 h-6 bg-[#60B5FF] rounded-full mr-3"></div>
                <h2 id="assets-heading" className="text-xl font-semibold">
                  Assets
                </h2>
              </div>
              <div className="space-y-4">{assets}</div>
            </section>
          </div>

          {children && (
            <section className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              {children}
            </section>
          )}
        </main>

        <footer className="bg-gradient-to-r from-[#60B5FF] to-[#8AC8FF] text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Dashboard. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
