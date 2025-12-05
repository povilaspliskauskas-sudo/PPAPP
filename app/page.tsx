"use client";

import Link from "next/link";

type Card = { href: string; icon: string; label: string };

const CARDS: Card[] = [
  { href: "/agenda",   icon: "📋", label: "Agenda" },
  { href: "/emotions", icon: "😊", label: "Emotions" },
];

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1200px] mx-auto px-4 text-center">
        <h1 className="sr-only">PPAPP</h1>

        {/* Gap equals icon size (240px) */}
        <div
          className="grid justify-items-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "240px" }}
        >
          {CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="tap-target block w-full max-w-[260px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
              aria-label={c.label}
            >
              <div className="rounded-2xl border shadow bg-white flex items-center justify-center w-[240px] h-[240px] mx-auto">
                <span aria-hidden className="text-[240px] leading-none">{c.icon}</span>
              </div>
              <div className="mt-3 text-center font-semibold text-xl">{c.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
