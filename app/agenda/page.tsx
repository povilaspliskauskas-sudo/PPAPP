"use client";

import { useMemo, useState } from "react";
import BackHome from "../components/BackHome";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";
import { getTasksForAge, Task } from "@/lib/presets";

export default function AgendaPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const tasks: Task[] = useMemo(() => {
    if (!child?.age && child?.age !== 0) return [];
    return getTasksForAge(child.age);
  }, [child]);

  function toggleTask(task: Task) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(task.key)) next.delete(task.key);
      else next.add(task.key);
      return next;
    });
  }

  return (
    <main className="min-h-screen w-screen grid place-items-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-6 p-4">
        <BackHome />

        <h1 className="text-2xl font-semibold">Agenda</h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <ChildSwitcher value={child?.id} onChange={setChild} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border px-3 py-2 shadow"
            aria-label="Select date"
          />
        </div>

        {!child && (
          <p className="text-gray-600">Choose a child to see age-appropriate tasks.</p>
        )}

        {child && (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
          >
            {tasks.map((task) => {
              const isOn = checked.has(task.key);
              return (
                <button
                  key={task.key}
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => toggleTask(task)}
                  className={`tap-target text-left inline-flex flex-col items-center rounded-2xl border px-3 py-4 shadow active:scale-95 ${
                    isOn ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
                  }`}
                >
                  <div className="text-[96px] leading-none" aria-hidden="true">
                    {task.icon}
                  </div>
                  <div className="font-medium mt-2">{task.label}</div>
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
      </div>
    </main>
  );
}
