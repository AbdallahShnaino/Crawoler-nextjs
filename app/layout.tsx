import { AuthProvider } from "@/context/user";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "@/app/globals.css";
export const metadata: Metadata = {
  title: "Dashboard | Domain & Asset Management",
  description:
    "Comprehensive dashboard for managing domains and digital assets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Toaster />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
