"use client";
import { useEffect, useState } from "react";
type Child = { id: number; name: string; age: number };

export default function ChildSwitcher({ value, onChange }: { value?: number; onChange: (id: number) => void; }) {
  const [children, setChildren] = useState<Child[]>([]);
  useEffect(() => {
    fetch("/api/children").then(async (r) => {
      const data = await r.json();
      setChildren(data.children ?? data);
    });
  }, []);
  return (
    <div className="flex gap-2 flex-wrap">
      {children.map((c) => (
        <button key={c.id} onClick={() => onChange(c.id)}
          className={`px-4 py-2 rounded-2xl border shadow active:scale-95 ${value === c.id ? "bg-gray-100" : ""}`}>
          {c.name} ({c.age})
        </button>
      ))}
    </div>
  );
}
