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
    fetch("/api/children")
      .then((r) => r.json())
      .then((data) => {
        const arr: Child[] = data.children ?? data;
        setChildren(arr);
        if (!selected && arr.length) {
          setSelected(arr[0].id);
          onChange(arr[0]);
        }
      })
      .catch(() => setChildren([]));
  }, []);

  return (
    <div className="flex gap-2 flex-wrap">
      {children.map((c) => (
        <button
          key={c.id}
          onClick={() => {
            setSelected(c.id);
            onChange(c);
          }}
          className={`rounded-2xl border px-3 py-2 shadow active:scale-95 ${
            selected === c.id ? "bg-gray-100" : ""
          }`}
        >
          {c.name} ({c.age})
        </button>
      ))}
    </div>
  );
}
