export type DaySlot = "morning" | "afternoon" | "evening";
export type Task = { key: string; label: string; icon: string; slot: DaySlot };

export const SLOTS: DaySlot[] = ["morning", "afternoon", "evening"];
export const slotLabel: Record<DaySlot, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export function getTasksForAge(age: number): Task[] {
  if (age >= 6) {
    // ~6 y/o (primary)
    return [
      { key: "dress", label: "Dress self", icon: "👕", slot: "morning" },
      { key: "brush_teeth_am", label: "Brush teeth", icon: "🪥", slot: "morning" },
      { key: "pack_bag", label: "Pack school bag", icon: "🎒", slot: "morning" },
      { key: "snack", label: "Healthy snack", icon: "🍎", slot: "afternoon" },
      { key: "homework", label: "Homework", icon: "📘", slot: "afternoon" },
      { key: "play", label: "Play outside", icon: "⚽️", slot: "afternoon" },
      { key: "brush_teeth_pm", label: "Brush teeth", icon: "🪥", slot: "evening" },
      { key: "bath", label: "Bath / shower", icon: "🛁", slot: "evening" },
      { key: "story", label: "Story time", icon: "📖", slot: "evening" },
    ];
  }
  if (age >= 2) {
    // 2–5 y/o (preschool)
    return [
      { key: "dress_help", label: "Get dressed (help)", icon: "🧥", slot: "morning" },
      { key: "toilet", label: "Toilet / diaper", icon: "🚽", slot: "morning" },
      { key: "brush_teeth_am", label: "Brush teeth", icon: "🪥", slot: "morning" },
      { key: "snack", label: "Snack", icon: "🍌", slot: "afternoon" },
      { key: "play_blocks", label: "Build / blocks", icon: "🧱", slot: "afternoon" },
      { key: "outside", label: "Outside play", icon: "🛝", slot: "afternoon" },
      { key: "bath", label: "Bath", icon: "🛁", slot: "evening" },
      { key: "pajamas", label: "Pajamas", icon: "🧸", slot: "evening" },
      { key: "story", label: "Story / songs", icon: "📖", slot: "evening" },
    ];
  }
  // <2 y/o (toddler)
  return [
    { key: "diaper_morn", label: "Diaper", icon: "🧷", slot: "morning" },
    { key: "breakfast", label: "Breakfast", icon: "🥣", slot: "morning" },
    { key: "nap", label: "Nap", icon: "🛏️", slot: "afternoon" },
    { key: "play_soft", label: "Soft play", icon: "🧩", slot: "afternoon" },
    { key: "diaper_even", label: "Diaper", icon: "🧷", slot: "evening" },
    { key: "bath", label: "Bath", icon: "🛁", slot: "evening" },
    { key: "bed", label: "Bedtime", icon: "🌙", slot: "evening" },
  ];
}
