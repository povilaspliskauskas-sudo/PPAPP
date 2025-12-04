"use client";
import { useEffect, useState } from "react";

export type Child = { id: number; name: string; age: number };

export default function ChildSwitcher({
  value,
  onChange,
}: {
  value?: number;
  onChange: (child: Child) => void;
}) {
  const [children, setChildren] = useState<Child[]>([]);
  const [selected, setSelected] = useState<number | undefined>(value);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/children", { cache: "no-store" });
        const data = res.ok ? await res.json() : null;
        if (!alive) return;

        const arr: Child[] = Array.isArray(data)
          ? data
          : data?.children ?? [];

        if (arr.length) {
          setChildren(arr);
          const pick = value ?? arr[0].id;
          setSelected(pick);
          onChange(arr.find(c => c.id === pick)!);
          return;
        }
      } catch {}
      // Fallback demo data
      if (alive) {
        const fallback: Child[] = [
          { id: 1, name: "Matas", age: 6 },
          { id: 2, name: "Ema", age: 3 },
        ];
        setChildren(fallback);
        const pick = value ?? fallback[0].id;
        setSelected(pick);
        onChange(fallback.find(c => c.id === pick)!);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => { setSelected(value); }, [value]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {children.map(c => {
        const pressed = selected === c.id;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={pressed}
            onClick={() => { setSelected(c.id); onChange(c); }}
            className={`tap-target rounded-full border px-4 py-2 shadow active:scale-95 ${
              pressed ? "bg-emerald-100 outline outline-2 outline-emerald-400" : "bg-white"
            }`}
          >
            <span className="font-medium">{c.name}</span>
            <span className="ml-1 text-sm text-gray-500">({c.age})</span>
          </button>
        );
      })}
    </div>
  );
}
