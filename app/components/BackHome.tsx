"use client";
import Link from "next/link";

export default function BackHome() {
  return (
    <div className="p-4 flex justify-center">
      <Link
        href="/"
        aria-label="Home"
        className="tap-target w-[240px] h-[240px] rounded-2xl border shadow active:scale-95
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500
                   flex items-center justify-center"
      >
        <span aria-hidden="true" className="leading-none text-[120px]">🏠</span>
        <span className="sr-only">Home</span>
      </Link>
    </div>
  );
}
