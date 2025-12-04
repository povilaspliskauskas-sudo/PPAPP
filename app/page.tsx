"use client";
export default function Home() {
  return (
    <main className="min-h-screen w-screen grid place-items-center">
      <div className="flex flex-col items-center justify-center gap-8 text-center">
        <span aria-hidden="true" className="leading-none text-[120px]">🏠</span>
        <h1 className="text-2xl font-semibold">PPAPP</h1>

        <div className="flex flex-wrap items-center justify-center gap-8">
          <a
            href="/agenda"
            aria-label="Agenda"
            className="rounded-2xl border p-4 shadow active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
            title="Agenda"
          >
            <span aria-hidden="true" className="leading-none text-[96px]">🗓️</span>
          </a>

          <a
            href="/emotions"
            aria-label="Emotions"
            className="rounded-2xl border p-4 shadow active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
            title="Emotions"
          >
            <span aria-hidden="true" className="leading-none text-[96px]">😊</span>
          </a>
        </div>
      </div>
    </main>
  );
}
