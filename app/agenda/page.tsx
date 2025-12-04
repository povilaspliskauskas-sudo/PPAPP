"use client";
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
import { useMemo, useState } from "react";
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">import BackHome from "../components/BackHome";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">import { getTasksForAge, Task } from "@/lib/presets";

      <div className="w-full max-w-[900px] mx-auto px-4 text-center">export default function AgendaPage() {
  const [child, setChild] = useState<Child | undefined>();
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  return (
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  const [checked, setChecked] = useState<Set<string>>(new Set());

      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  const tasks: Task[] = useMemo(() => {
    if (child?.age === undefined) return [];
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">    return getTasksForAge(child.age);
  }, [child]);
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
  function toggleTask(task: Task) {
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">    setChecked(prev => {
      const next = new Set(prev);
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">      if (next.has(task.key)) next.delete(task.key);
      else next.add(task.key);
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">      return next;
    });
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  }

      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  return (
    <main className="w-full flex flex-col items-center">
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">      <BackHome />
      <h1 className="text-3xl font-semibold">Agenda</h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-3">
        <ChildSwitcher value={child?.id} onChange={setChild} />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-2xl border px-3 py-2 shadow"
          aria-label="Select date"
        />
      </div>

      {!child && <p className="text-gray-600">Choose a child to see age-appropriate tasks.</p>}

      {child && (
        <div
          className="grid gap-6 justify-items-center w-full"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
        >
          {tasks.map((task) => {
            const isOn = checked.has(task.key);
            return (
              <button
                key={task.key}
                type="button"
                aria-pressed={isOn}
                onClick={() => toggleTask(task)}
                className={`tap-target text-center inline-flex flex-col items-center rounded-2xl border px-4 py-5 shadow active:scale-95 ${
                  isOn ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
                }`}
              >
                <div className="text-[96px] leading-none" aria-hidden="true">
                  {task.icon}
                </div>
                <div className="font-medium mt-3">{task.label}</div>
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
    </main>
  );
}
</div>
