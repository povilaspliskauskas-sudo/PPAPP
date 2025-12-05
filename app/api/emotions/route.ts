import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emotion_enum as EMOTION_ENUM } from "@prisma/client";
import type { emotion_enum as EmotionEnum } from "@prisma/client";

/**
 * GET /api/emotions?childId=1&days=7&from=YYYY-MM-DD
 *  - returns entries (newest first) with {id, date, time, emotion, note, createdAt}
 *
 * POST /api/emotions
 *  body: { childId: number, emotion: string, note?: string }
 *  - appends a new entry (no toggle). Date bucket = UTC YYYY-MM-DD; createdAt = now
 */

function startOfDay(dateStr?: string) {
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

  const end = new Date(); // now
  const start = startOfDay(fromParam);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const rows = await prisma.emotionEntry.findMany({
    where: {
      childId,
      createdAt: { gte: start, lte: end },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true, emotion: true, note: true, date: true },
  });

  const items = rows.map((r) => {
    const created = new Date(r.createdAt);
    const hh = String(created.getUTCHours()).padStart(2, "0");
    const mm = String(created.getUTCMinutes()).padStart(2, "0");
    return {
      id: r.id,
      date: (r.date ?? created).toISOString().slice(0, 10),
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
  const note = body?.note ? String(body.note) : null;
  const raw = String(body?.emotion ?? "").trim();
  if (!childId || !raw) {
    return NextResponse.json({ error: "childId and emotion are required" }, { status: 400 });
  }

  // Normalize to enum values (UPPERCASE). Accept either key or value casing.
  const normalized = raw.toUpperCase();

  // EMOTION_ENUM is a value object like: { HAPPY: 'HAPPY', CALM: 'CALM', ... }
  const allowedValues = new Set(Object.values(EMOTION_ENUM)); // string[]
  const allowedKeys = new Set(Object.keys(EMOTION_ENUM));     // 'HAPPY', 'CALM', ...
  const finalValue =
    allowedValues.has(normalized) ? normalized :
    allowedKeys.has(normalized) ? (EMOTION_ENUM as Record<string, string>)[normalized] :
    null;

  if (!finalValue) {
    return NextResponse.json(
      { error: `emotion must be one of: ${Object.values(EMOTION_ENUM).join(", ")}` },
      { status: 400 }
    );
  }

  const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  const saved = await prisma.emotionEntry.create({
    data: {
      childId,
      date: new Date(`${dateStr}T00:00:00.000Z`),
      emotion: finalValue as EmotionEnum,
      note,
    },
    select: { id: true, childId: true, date: true, emotion: true, note: true, createdAt: true },
  });

  return NextResponse.json(saved, { status: 201 });
}
