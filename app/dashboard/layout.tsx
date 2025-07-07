import type { Metadata } from "next";
import { UserControls } from "@/components/User/UserControls";
import { Link, Voicemail } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dashboard | Domain & Asset Management",
  description:
    "Comprehensive dashboard for managing domains and digital assets",
};
export default async function RootLayout({
  domains,
  assets,
}: Readonly<{
  domains: React.ReactNode;
  assets: React.ReactNode;
}>) {
  return (
    <>
      <header className="bg-gradient-to-r from-[#FF9149] to-[#FFAA6B] text-white shadow-sm">
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2">
            <Image
              src="https://flagcdn.com/w40/ps.png"
              alt="Palestine flag img"
              width={32}
              height={20}
              className="w-8 h-5 rounded shadow-sm"
            />
            <span className="text-2xl font-extrabold tracking-wide text-white drop-shadow-sm">
              PalArchiver
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm opacity-90 mt-1">Domain & Asset Management</p>
          </div>
          <UserControls />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section
            id="domains"
            className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            aria-labelledby="domains-heading"
          >
            <div className="flex items-center mb-4">
              <Link color="#FF9149" className="mx-3" />
              <h2 id="domains-heading" className="text-base font-semibold">
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
              <Voicemail color="#60B5FF" className="mx-3" />
              <h2 id="assets-heading" className="text-base font-semibold">
                Assets
              </h2>
            </div>
            <div className="space-y-4">{assets}</div>
          </section>
        </div>
      </main>
      <footer className="bg-gradient-to-r from-[#60B5FF] to-[#8AC8FF] text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
