import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PPAPP",
  description: "Parent/Provider App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Full viewport and hard center */}
      <body className="min-h-screen w-screen grid place-items-center">
        {children}
      </body>
    </html>
  );
}
