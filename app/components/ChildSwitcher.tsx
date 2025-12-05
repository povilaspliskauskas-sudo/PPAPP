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
        const arr: Child[] = Array.isArray(data) ? data : data?.children ?? [];
        setChildren(arr);
        if (!value && arr.length > 0) {
          setSelected(arr[0].id);
          onChange(arr[0]);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-4">
        {children.map((c) => {
          const isActive = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelected(c.id);
                onChange(c);
              }}
              aria-pressed={isActive}
              className={`tap-target rounded-2xl border shadow px-6 py-4 min-w-[240px] h-[72px] text-xl font-semibold inline-flex items-center justify-center transition
                ${isActive ? "bg-emerald-50 outline outline-2 outline-emerald-400" : "bg-white"}`}
            >
              <span>{c.name}</span>
              <span className="ml-2 text-gray-500 text-lg">({c.age})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
