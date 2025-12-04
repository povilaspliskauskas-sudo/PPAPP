import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PPAPP",
  description: "Parent/Provider App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center">
        {/* Centered container for every page */}
        <div className="w-full max-w-screen-md p-4">{children}</div>
      </body>
    </html>
  );
}
