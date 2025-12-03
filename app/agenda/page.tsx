"use client";
import { useEffect, useState } from "react";
import ChildSwitcher from "../components/ChildSwitcher";
type AgendaItem = { id: number; childId: number; date: string; title: string; timeOfDay: "morning"|"afternoon"|"evening"; };
const times: AgendaItem["timeOfDay"][] = ["morning","afternoon","evening"];

export default function AgendaPage() {
  const [childId, setChildId] = useState<number>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newSlot, setNewSlot] = useState<AgendaItem["timeOfDay"]>("morning");

  const load = async () => {
    if (!childId) return;
    const res = await fetch(`/api/agenda?childId=${childId}&date=${date}`);
    const data = await res.json();
    setItems(data.items ?? data);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [childId, date]);

  const addItem = async () => {
    if (!childId || !newTitle.trim()) return;
    await fetch(`/api/agenda`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ childId, date, title: newTitle.trim(), timeOfDay: newSlot }),
    });
    setNewTitle("");
    await load();
  };
  const removeItem = async (id: number) => { await fetch(`/api/agenda?id=${id}`, { method: "DELETE" }); await load(); };

  return (
    <main className="min-h-screen p-4 space-y-4">
      <h1 className="text-xl font-bold">Agenda</h1>
      <ChildSwitcher value={childId} onChange={setChildId} />
      <div className="flex items-center gap-3">
        <label className="text-sm">Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded px-3 py-2" />
      </div>
      <div className="flex gap-2 items-center">
        <select className="border rounded px-3 py-2" value={newSlot} onChange={(e) => setNewSlot(e.target.value as any)}>
          {times.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input className="border rounded px-3 py-2 flex-1" placeholder="Add an activity" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} />
        <button onClick={addItem} className="rounded-2xl border px-4 py-2 shadow active:scale-95">+ Add</button>
      </div>
      {times.map((slot) => (
        <div key={slot} className="rounded-2xl border p-3">
          <h2 className="font-semibold mb-2 capitalize">{slot}</h2>
          <div className="flex flex-col gap-2">
            {items.filter((i)=>i.timeOfDay===slot).map((i)=>(
              <div key={i.id} className="flex justify-between items-center rounded-xl border px-3 py-2">
                <span>{i.title}</span>
                <button onClick={()=>removeItem(i.id)} className="text-sm rounded-xl border px-3 py-1 active:scale-95">Remove</button>
              </div>
            ))}
            {items.filter((i)=>i.timeOfDay===slot).length===0 && <div className="text-sm text-gray-500">No items</div>}
          </div>
        </div>
      ))}
    </main>
  );
}
