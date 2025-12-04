"use client";
import Link from "next/link";

export default function BackHome() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className="inline-flex items-center justify-center rounded-2xl border p-2 shadow active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
    >
      <span aria-hidden="true" className="leading-none text-[96px]">🏠</span>
      <span className="sr-only">Home</span>
    </Link>
  );
}
