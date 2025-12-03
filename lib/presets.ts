export type DaySlot = "morning" | "afternoon" | "evening";
export type Task = { key: string; label: string; icon: string; slot: DaySlot };

/**
 * Age buckets:
 * - age >= 6  → 6-year-old set
 * - 2–5       → 3-year-old set
 * - < 2       → 1-year-old set
 */
export function getTasksForAge(age: number): Task[] {
  if (age >= 6) {
    return [
      { key: "brush_am",  label: "Brush teeth",     icon: "🪥", slot: "morning" },
      { key: "dress",     label: "Get dressed",     icon: "👕", slot: "morning" },
      { key: "pack_bag",  label: "Pack backpack",   icon: "🎒", slot: "morning" },

      { key: "school",    label: "School / learn",  icon: "🏫", slot: "afternoon" },
      { key: "read",      label: "Read 15 min",     icon: "📚", slot: "afternoon" },
      { key: "play",      label: "Outdoor play",    icon: "⚽️", slot: "afternoon" },
      { key: "tidy",      label: "Tidy room/toys",  icon: "🧹", slot: "afternoon" },

      { key: "shower",    label: "Shower / bath",   icon: "🚿", slot: "evening" },
      { key: "brush_pm",  label: "Brush teeth",     icon: "🪥", slot: "evening" },
      { key: "lights",    label: "Lights out",      icon: "🌙", slot: "evening" },
    ];
  }

  if (age >= 2) {
    return [
      { key: "wake",      label: "Good morning",    icon: "🌞", slot: "morning" },
      { key: "toilet",    label: "Potty / toilet",  icon: "🚽", slot: "morning" },
      { key: "breakfast", label: "Breakfast",       icon: "🍞", slot: "morning" },

      { key: "outdoor",   label: "Outdoor play",    icon: "🏞️", slot: "afternoon" },
      { key: "nap",       label: "Nap",             icon: "😴", slot: "afternoon" },
      { key: "tidy",      label: "Tidy toys",       icon: "🧸", slot: "afternoon" },

      { key: "bath",      label: "Bath",            icon: "🛁", slot: "evening" },
      { key: "story",     label: "Storytime",       icon: "📖", slot: "evening" },
      { key: "brush",     label: "Brush teeth",     icon: "🪥", slot: "evening" },
    ];
  }

  return [
    { key: "diaper_am", label: "Diaper",    icon: "🧷", slot: "morning" },
    { key: "milk_am",   label: "Milk",      icon: "🍼", slot: "morning" },

    { key: "tummy",     label: "Tummy time",icon: "🤸", slot: "afternoon" },
    { key: "nap",       label: "Nap",       icon: "😴", slot: "afternoon" },
    { key: "fresh",     label: "Fresh air", icon: "🌳", slot: "afternoon" },

    { key: "bath",      label: "Bath",      icon: "🛁", slot: "evening" },
    { key: "milk_pm",   label: "Milk",      icon: "🍼", slot: "evening" },
    { key: "sleep",     label: "Sleep",     icon: "🌙", slot: "evening" },
  ];
}

export const SLOTS: DaySlot[] = ["morning", "afternoon", "evening"];
export const slotLabel: Record<DaySlot, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};
