import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Allowed UI emotion keys (lowercase)
const ALLOWED = ["happy","calm","excited","neutral","sad","angry","tired"] as const;
type EmotionKey = typeof ALLOWED[number];

// Map UI key -> DB enum value (uppercase names in your prisma enum `emotion_enum`)
const toEnum = (k: EmotionKey) => k.toUpperCase() as unknown as any;

/**
 * GET /api/emotions?childId=1&from=YYYY-MM-DD&days=7
 * Returns presses in the window [start..end], where:
 *   end   = end of "from" day (23:59:59.999Z)
 *   start = (days-1) days before "from" at 00:00:00.000Z
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const childId = Number(searchParams.get("childId"));
  const fromStr = searchParams.get("from") ?? new Date().toISOString().slice(0,10);
  const days    = Number(searchParams.get("days") ?? "7");

  if (!childId || !Number.isFinite(childId) || !Number.isFinite(days) || days < 1) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  // Window: start..end (UTC)
  const fromDate = new Date(`${fromStr}T00:00:00.000Z`);
  const start = new Date(fromDate);
  start.setUTCDate(start.getUTCDate() - (days - 1)); // include previous days
  const end = new Date(fromDate);
  end.setUTCHours(23, 59, 59, 999);

  const rows = await prisma.emotionEntry.findMany({
    where: {
      childId,
      createdAt: { gte: start, lte: end },
    },
    select: { id: true, childId: true, date: true, emotion: true, note: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const items = rows.map(r => {
    const dt = new Date(r.createdAt);
    const hh = String(dt.getUTCHours()).padStart(2, "0");
    const mm = String(dt.getUTCMinutes()).padStart(2, "0");
    return {
      id: r.id,
      date: dt.toISOString().slice(0,10),      // YYYY-MM-DD
      time: `${hh}:${mm}`,                      // HH:MM (UTC)
      emotion: String(r.emotion).toLowerCase(), // back to lowercase for UI
      note: r.note,
      createdAt: dt.toISOString(),
    };
  });

  return NextResponse.json({ items });
}

/**
 * POST /api/emotions
 * body: { childId: number, emotion: "happy" | ... }
 * Saves a new press (does NOT toggle).
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { childId?: number; emotion?: string } | null;
  const childId = Number(body?.childId ?? 0);
  const emotionRaw = String(body?.emotion ?? "").toLowerCase();

  if (!childId || !ALLOWED.includes(emotionRaw as EmotionKey)) {
    return NextResponse.json({ error: "Invalid childId or emotion" }, { status: 400 });
  }

  // date-only column (midnight UTC) + createdAt is automatic now()
  const today = new Date();
  const dateOnly = new Date(`${today.toISOString().slice(0,10)}T00:00:00.000Z`);

  const saved = await prisma.emotionEntry.create({
    data: {
      childId,
      date: dateOnly,
      emotion: toEnum(emotionRaw as EmotionKey), // convert to DB enum
      note: null,
    },
    select: { id: true, childId: true, date: true, emotion: true, note: true, createdAt: true },
  });

  const dt = new Date(saved.createdAt);
  const hh = String(dt.getUTCHours()).padStart(2, "0");
  const mm = String(dt.getUTCMinutes()).padStart(2, "0");

  return NextResponse.json({
    id: saved.id,
    date: dt.toISOString().slice(0,10),
    time: `${hh}:${mm}`,
    emotion: String(saved.emotion).toLowerCase(),
    note: saved.note,
    createdAt: dt.toISOString(),
  });
}
