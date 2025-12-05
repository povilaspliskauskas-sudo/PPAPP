"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

type HistoryItem = { id: number; date: string; time: string; emotion: string; createdAt: string; note?: string | null };

const EMOJIS = [
  { key: "happy",   icon: "😊", label: "Happy" },
  { key: "calm",    icon: "😌", label: "Calm" },
  { key: "excited", icon: "��", label: "Excited" },
  { key: "neutral", icon: "😐", label: "Neutral" },
  { key: "sad",     icon: "😢", label: "Sad" },
  { key: "angry",   icon: "😠", label: "Angry" },
  { key: "tired",   icon: "🥱", label: "Tired" },
] as const;

export default function EmotionsPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [historyOpen, setHistoryOpen] = useState(false);

  // filters
  const [from, setFrom] = useState<string>(new Date().toISOString().slice(0,10));
  const [days, setDays] = useState<number>(30);
  const [emotionFilter, setEmotionFilter] = useState<string>("all");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [lastPressed, setLastPressed] = useState<string | null>(null);

  const selectedChildLabel = useMemo(() => {
    return child ? `${child.name} (${child.age})` : "Select child";
  }, [child]);

  async function sendEmotion(key: string) {

async function sendEmotion(key: string) {
  if (!child?.id) return;
  setLastPressed(key);
  try {
    const res = await fetch("/api/emotions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ childId: child.id, emotion: key }),
    });
    const saved = await res.json().catch(() => null);
    // If history is open and the saved record matches current filters, show it immediately
    if (historyOpen && saved && saved.date) {
      // Match filters: emotion, date window
      const from = new Date((document.querySelector('input[type="date"][value="'+(document.querySelector('input[type="date"][value]') as HTMLInputElement)?.value+'"]') as HTMLInputElement)?.value || "");
      // We rely on our state instead of DOM:
      // We only append when emotionFilter is "all" or matches
      // and when saved.date is within [from, from+days)
      const okEmotion = (emotionFilter === "all" || saved.emotion === emotionFilter);
      const nowYMD = saved.date; // "YYYY-MM-DD"
      const fromDate = new Date(from ?? new Date());
      const toDate = new Date(fromDate);
      toDate.setUTCDate(toDate.getUTCDate() + (days || 30));
      const savedDate = new Date(nowYMD + "T00:00:00.000Z");
      const okRange = savedDate >= fromDate && savedDate < toDate;

      if (okEmotion && okRange) {
        setItems(prev => [{ ...saved }, ...prev]);
      }
    }
  } catch {}
}
