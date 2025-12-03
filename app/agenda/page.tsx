"use client";

import { useEffect, useMemo, useState } from "react";
import BackHome from "../components/BackHome";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";
import { getTasksForAge, SLOTS, slotLabel, Task } from "@/lib/presets";

type EventItem = { id: number; title: string; icon: string };

export default function AgendaPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const tasks = useMemo(() => getTasksForAge(child?.age ?? 3), [child?.age]);

  const refresh = async (cid: number, d: string) => {
    const url = `/api/agenda?childId=${cid}&date=${d}`;
    const res = await fetch(url);
    const { items } = (await res.json()) as { items: EventItem[] };
    setCheckedKeys(new Set(items.map((i) => i.title)));
  };

  useEffect(() => {
    if (child?.id && date) {
      refresh(child.id, date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child?.id, date]);

  const toggle = async (task: Task) => {
    if (!child?.id) return;
    setLoading(true);
    try {
      const res = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId: child.id, date, task }),
      });
      const data = await res.json();
      const keys = new Set((data.items as EventItem[]).map((i) => i.title));
      setCheckedKeys(keys);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 flex flex-col gap-4">
      <BackHome />

      <h1 className="text-2xl font-bold px-4">📅 Agenda</h1>

      <div className="flex flex-wrap items-center gap-3 px-4">
        <ChildSwitcher value={child?.id} onChange={(c) => setChild(c)} />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border px-3 py-2 shadow"
        />
      </div>

      {SLOTS.map((slot) => {
        const slotTasks = tasks.filter((t) => t.slot === slot);
        return (
          <section key={slot} className="px-4">
            <h2 className="mt-4 mb-2 text-lg font-semibold">{slotLabel[slot]}</h2>
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", display: "grid" }}
            >
              {slotTasks.map((task) => {
                const isOn = checkedKeys.has(task.key);
                return (
                  <button
                    key={task.key}
                    onClick={() => toggle(task)}
                    disabled={loading}
                    className={`h-28 rounded-2xl border shadow flex flex-col items-center justify-center gap-2 active:scale-95 ${
                      isOn ? "outline outline-2 outline-emerald-400" : ""
                    }`}
                  >
                    <div className="text-3xl" aria-hidden>
                      {task.icon}
                    </div>
                    <div className="text-sm text-center px-2">{task.label}</div>
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isOn ? "bg-emerald-100" : "bg-gray-100"
                      }`}
                    >
                      {isOn ? "Done" : "To do"}
                    </div>
                  </button>
                );
              })}
            </div>
            {slotTasks.length === 0 && (
              <div className="text-sm text-gray-500">No tasks for this slot.</div>
            )}
          </section>
        );
      })}
    </main>
  );
}
