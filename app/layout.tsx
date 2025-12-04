import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PPAPP",
  description: "Parent Planner App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {/* Center EVERYTHING both vertically and horizontally */}
        <div className="min-h-screen w-screen flex items-center justify-center">
          {/* Single, centered content column for all pages */}
          <div className="w-full max-w-5xl px-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
