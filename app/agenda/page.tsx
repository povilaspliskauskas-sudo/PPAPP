"use client";
import { useEffect, useMemo, useState, memo } from "react";
import BackHome from "../components/BackHome";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";
import { getTasksForAge, SLOTS, slotLabel, Task } from "@/lib/presets";

type TaskCardProps = { task: Task; isOn: boolean; onToggle: (t: Task) => void };

const TaskCard = memo(function TaskCard({ task, isOn, onToggle }: TaskCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isOn}
      onClick={() => onToggle(task)}
      className={`tap-target text-center inline-flex flex-col items-center rounded-2xl border px-3 py-2 shadow active:scale-95 ${
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
});

export default function AgendaPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());

  const tasks = useMemo(() => getTasksForAge(child?.age ?? 3), [child?.age]);

  // Reset checks when switching child or date
  useEffect(() => {
    setCheckedKeys(new Set());
  }, [child?.id, date]);

  function toggleTask(task: Task) {
    const willTurnOn = !checkedKeys.has(task.key);

    // Instant UI
    setCheckedKeys(prev => {
      const next = new Set(prev);
      if (next.has(task.key)) next.delete(task.key);
      else next.add(task.key);
      return next;
    });

    // Fire-and-forget network
    const send = () => {
      fetch(`/api/agenda?childId=${child?.id ?? ""}&date=${date}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskKey: task.key, slot: task.slot, on: willTurnOn }),
        keepalive: true,
      }).catch(() => {});
    };
    if (typeof (globalThis as any).requestIdleCallback !== "undefined") {
      (globalThis as any).requestIdleCallback(() => send(), { timeout: 500 });
    } else {
      setTimeout(send, 200);
    }
  }

  const bySlot: Record<string, Task[]> = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const s of SLOTS) map[s] = [];
    for (const t of tasks) map[t.slot]?.push(t);
    return map;
  }, [tasks]);

  return (
    <main className="w-full">
      <div className="flex items-center justify-center gap-3 mb-6">
        <BackHome />
        <ChildSwitcher value={child?.id} onChange={setChild as any} />
        <input
          type="date"
          className="border rounded-xl px-3 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Select date"
        />
      </div>

      {SLOTS.map((slot) => (
        <section key={slot} aria-labelledby={`slot-${slot}`} className="mb-6">
          <h2 id={`slot-${slot}`} className="text-lg font-semibold text-center">{slotLabel[slot]}</h2>
          <div
            className="grid gap-3 justify-center place-items-center mt-3"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
          >
            {bySlot[slot].length === 0 && (
              <div className="text-sm text-gray-500 text-center">No tasks for this slot.</div>
            )}
            {bySlot[slot].map((task) => (
              <TaskCard
                key={task.key}
                task={task}
                isOn={checkedKeys.has(task.key)}
                onToggle={toggleTask}
              />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
