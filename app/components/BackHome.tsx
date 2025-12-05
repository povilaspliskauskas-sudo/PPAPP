"use client";
import Link from "next/link";

export default function BackHome() {
  return (
    <div className="p-4 flex justify-center">
      <Link
        href="/"
        aria-label="Home"
        className="inline-flex items-center justify-center rounded-2xl border p-2 shadow active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
      >
        {/* 240×240 square with 240px emoji */}
        <div className="w-[240px] h-[240px] flex items-center justify-center">
          <span aria-hidden="true" className="leading-none text-[240px]">🏠</span>
        </div>
        <span className="sr-only">Home</span>
      </Link>
    </div>
  );
}
