import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PPAPP",
  description: "Parent Planning App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen m-0 flex items-center justify-center bg-white text-gray-900">
        <div className="w-full max-w-[900px] px-4">{children}</div>
      </body>
    </html>
  );
}
