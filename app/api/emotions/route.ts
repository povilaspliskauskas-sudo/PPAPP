import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/emotions?childId=1&days=7&from=YYYY-MM-DD
 *  - returns array of entries (newest first) with {id, date, time, emotion, note, createdAt}
 *
 * POST /api/emotions
 *  body: { childId: number, emotion: string, note?: string }
 *  - creates a new entry (append-only) with current timestamp; date is set to YYYY-MM-DD (UTC)
 */

function startOfDay(dateStr?: string) {
  // dateStr in YYYY-MM-DD; if missing, use today UTC
  const iso = (dateStr ?? new Date().toISOString().slice(0, 10)) + "T00:00:00.000Z";
  return new Date(iso);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const childId = Number(searchParams.get("childId"));
  if (!childId) {
    return NextResponse.json({ error: "childId is required" }, { status: 400 });
  }

  const days = Math.max(1, Math.min(31, Number(searchParams.get("days") ?? 7)));
  const fromParam = searchParams.get("from") ?? undefined;

  // Compute window by createdAt (more precise than date)
  const end = new Date(); // now
  const start = startOfDay(fromParam);
  // If days provided, shift start back (cover N days)
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const rows = await prisma.emotionEntry.findMany({
    where: {
      childId,
      createdAt: { gte: start, lte: end },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true, emotion: true, note: true, date: true },
  });

  // decorate with time HH:MM from createdAt
  const items = rows.map((r) => {
    const d = new Date(r.createdAt);
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    return {
      id: r.id,
      date: (r.date ?? d).toISOString().slice(0, 10),
      time: `${hh}:${mm} UTC`,
      emotion: r.emotion,
      note: r.note ?? null,
      createdAt: r.createdAt,
    };
  });

  return NextResponse.json({ items, range: { from: start.toISOString(), to: end.toISOString() } });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const childId = Number(body?.childId);
  const emotion = String(body?.emotion ?? "");
  const note = body?.note ? String(body.note) : null;

  if (!childId || !emotion) {
    return NextResponse.json(
      { error: "childId and emotion are required" },
      { status: 400 }
    );
  }

  // date (day bucket) is stored as YYYY-MM-DDT00:00:00.000Z
  const dateStr = new Date().toISOString().slice(0, 10);
  const saved = await prisma.emotionEntry.create({
    data: {
      childId,
      date: new Date(`${dateStr}T00:00:00.000Z`),
      emotion,
      note,
    },
    select: { id: true, childId: true, date: true, emotion: true, note: true, createdAt: true },
  });

  return NextResponse.json(saved, { status: 201 });
}
