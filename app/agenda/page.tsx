"use client";

import { useMemo, useState } from "react";
import BackHome from "../components/BackHome";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";
import { getTasksForAge, SLOTS, slotLabel, Task } from "@/lib/presets";

export default function AgendaPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());

  const tasks = useMemo<Task[]>(() => {
    if (!child) return [];
    return getTasksForAge(child.age);
  }, [child]);

  function toggleTask(task: Task) {
    const willTurnOn = !checkedKeys.has(task.key);
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(task.key)) next.delete(task.key); else next.add(task.key);
      return next;
    });

    // send network call later so the tap is instant
    try {
      const payload = { taskKey: task.key, slot: task.slot, on: willTurnOn };
      // Prefer idle time, fallback to small timeout
      const doSend = () => fetch(`/api/agenda?childId=${child?.id ?? ""}&date=${date}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(() => doSend(), { timeout: 500 });
      } else {
        setTimeout(doSend, 200);
      }
    } catch {}
    return;
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(task.key)) next.delete(task.key);
      else next.add(task.key);
      return next;

    // Optional: non-blocking best-effort sync (ignore failures)
    try {
      fetch(`/api/agenda?childId=${child?.id ?? ""}&date=${date}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskKey: task.key, slot: task.slot }),
      }).catch(() => {});
    } catch {}
  }

  // Group tasks by slot for layout
  const bySlot: Record<string, Task[]> = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const s of SLOTS) map[s] = [];
    for (const t of tasks) map[t.slot]?.push(t);
    return map;
  }, [tasks]);

  return (
    <main className="p-4 space-y-6">
      <BackHome />

      <header className="flex items-center gap-3">
        <ChildSwitcher
          value={child?.id}
          onChange={(c) => setChild(c)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border px-3 py-2 shadow"
          aria-label="Select date"
        />
      </header>

      {!child && (
        <p className="text-sm text-gray-600">
          Choose a child to see their daily checklist.
        </p>
      )}

      {child &&
        SLOTS.map((slot) => {
          const list = bySlot[slot] || [];
          return (
            <section key={slot} className="space-y-3">
              <h2 className="text-lg font-semibold">{slotLabel[slot]}</h2>

              {list.length === 0 ? (
                <div className="text-sm text-gray-500">No tasks for this slot.</div>
              ) : (
                <div
                  className="grid gap-3"
                  style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
                >
                  {list.map((task) => {
                    const isOn = checkedKeys.has(task.key);
                    return (
                      <button
                        key={task.key}
                        type="button"
                        aria-pressed={isOn}
                        onClick={() => toggleTask(task)}
                        className={`tap-target text-left inline-flex flex-col items-start rounded-2xl border px-3 py-2 shadow active:scale-95 ${
                          isOn ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
                        }`}
                      >
                        <div className="text-[96px]" aria-hidden="true">{task.icon}</div>
                        <div className="font-medium mt-1">{task.label}</div>
                        <div
                          className={`mt-2 text-xs inline-block rounded-full px-2 py-0.5 ${
                            isOn ? "bg-emerald-100" : "bg-gray-100"
                          }`}
                        >
                          {isOn ? "Done" : "To do"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
    </main>
  );
}
