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
    fetch("/api/children").then(async (r) => {
      const data = await r.json();
      const arr: Child[] = data.children ?? data;
      setChildren(arr);
      if (!selected && arr.length > 0) {
        setSelected(arr[0].id);
        onChange(arr[0]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          className={`px-3 py-2 rounded-2xl border shadow active:scale-95 ${
            selected === c.id ? "bg-gray-100" : ""
          }`}
          title={`${c.name} (${c.age})`}
        >
          {c.name} ({c.age})
        </button>
      ))}
    </div>
  );
}
