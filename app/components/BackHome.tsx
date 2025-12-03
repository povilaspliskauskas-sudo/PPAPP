"use client";
import Link from "next/link";

export default function BackHome() {
  return (
    <div className="p-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 shadow active:scale-95"
      >
        ← Home
      </Link>
    </div>
  );
}
