import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * GET /api/emotions?childId=1&days=7&from=YYYY-MM-DD
 *  - returns array of entries (newest first) with {id, date, time, emotion, note, createdAt}
 *
 * POST /api/emotions
 *  body: { childId: number, emotion: string (case-insensitive), note?: string }
 *  - appends a new entry (no toggling), date bucket is YYYY-MM-DD (UTC), createdAt is now
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
  let emotionRaw = String(body?.emotion ?? "");

  if (!childId || !emotionRaw) {
    return NextResponse.json(
      { error: "childId and emotion are required" },
      { status: 400 }
    );
  }

  // Normalize to UPPERCASE to match enum identifier casing
  const normalized = emotionRaw.toUpperCase();

  // Prisma enums are available at runtime on Prisma.<EnumName>
  // Adjust the enum name below if your schema uses a different one than `emotion_enum`
  const EM = Prisma.emotion_enum as unknown as Record<string, string> | undefined;
  if (!EM) {
    return NextResponse.json(
      { error: "Prisma enum `emotion_enum` not found. Check your schema enum name." },
      { status: 500 }
    );
  }
  const allowed = new Set(Object.values(EM));
  if (!allowed.has(normalized)) {
    return NextResponse.json(
      { error: `emotion must be one of: ${Array.from(allowed).join(", ")}` },
      { status: 400 }
    );
  }

  // date bucket (YYYY-MM-DDT00:00:00.000Z)
  const dateStr = new Date().toISOString().slice(0, 10);

  const saved = await prisma.emotionEntry.create({
    data: {
      childId,
      date: new Date(`${dateStr}T00:00:00.000Z`),
      emotion: normalized as unknown as (typeof Prisma.emotion_enum)[keyof typeof Prisma.emotion_enum],
      note,
    },
    select: { id: true, childId: true, date: true, emotion: true, note: true, createdAt: true },
  });

  return NextResponse.json(saved, { status: 201 });
}
