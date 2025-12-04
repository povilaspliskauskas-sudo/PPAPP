"use client";

import { useMemo, useState } from "react";
import BackHome from "../components/BackHome";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";
import { getTasksForAge, SLOTS, slotLabel, Task } from "@/lib/presets";

export default function AgendaPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());

  const tasks: Task[] = useMemo(
    () => getTasksForAge(child?.age ?? 4),
    [child?.age]
  );

  const bySlot: Record<string, Task[]> = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const s of SLOTS) map[s] = [];
    for (const t of tasks) map[t.slot].push(t);
    return map;
  }, [tasks]);

  function toggleTask(task: Task) {
    setCheckedKeys(prev => {
      const next = new Set(prev);
      if (next.has(task.key)) next.delete(task.key);
      else next.add(task.key);
      return next;
    });
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
        <BackHome />

        <h1 className="text-2xl font-semibold mb-4">Agenda</h1>

        <div className="mb-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <ChildSwitcher
            value={child?.id}
            onChange={(c) => setChild(c)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border px-3 py-2 shadow"
            aria-label="Select date"
          />
        </div>

        {SLOTS.map((slot) => {
          const list = bySlot[slot] || [];
          return (
            <section key={slot} className="mb-8">
              <h2 className="text-xl font-semibold mb-3">{slotLabel[slot]}</h2>

              {list.length === 0 ? (
                <div className="text-sm text-gray-500">No tasks for this slot.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
                  {list.map((task) => {
                    const isOn = checkedKeys.has(task.key);
                    return (
                      <button
                        key={task.key}
                        type="button"
                        aria-pressed={isOn}
                        onClick={() => toggleTask(task)}
                        className={`tap-target text-left inline-flex flex-col items-center rounded-2xl border px-4 py-6 shadow active:scale-95 ${
                          isOn ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
                        }`}
                      >
                        <div className="leading-none text-[120px]" aria-hidden="true">{task.icon}</div>
                        <div className="mt-2 text-base font-medium">{task.label}</div>
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
      </div>
    </main>
  );
}
