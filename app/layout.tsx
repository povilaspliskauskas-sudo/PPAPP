import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PPAPP",
  description: "Parent/Provider App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-screen flex items-center justify-center">
        {/* Full-screen centering; children decide their own max width */}
        {children}
      </body>
    </html>
  );
}
