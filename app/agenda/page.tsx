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
      <div className={`mt-2 text-xs inline-block rounded-full px-2 py-0.5 ${isOn ? "bg-emerald-100" : "bg-gray-100"}`}>
        {isOn ? "Done" : "To do"}
      </div>
    </button>
  );
});

export default function AgendaPage() {
{
  return (
    <main className="min-h-screen w-screen grid place-items-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center p-4 gap-6">
      </div>
    </main>
  );
}
  );
}
