import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/emotions?childId=1&date=YYYY-MM-DD */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const childId = Number(searchParams.get("childId"));
  const dateStr = searchParams.get("date") ?? new Date().toISOString().slice(0,10);
  if (!childId) return NextResponse.json({ error: "childId is required" }, { status: 400 });

  const date = new Date(`${dateStr}T00:00:00.000Z`);

  const row = await prisma.emotionEntry.findUnique({
    where: { childId_date: { childId, date } },
  }).catch(async () => {
    // If compound unique name differs (older clients), fallback:
    return prisma.emotionEntry.findFirst({ where: { childId, date } });
  });

  return NextResponse.json(row ?? {});
}

/** POST /api/emotions { childId, date, emotion, note? } */
export async function POST(req: Request) {
  const { childId, date: dateStr, emotion, note } = await req.json();
  if (!childId || !dateStr || !emotion) {
    return NextResponse.json({ error: "childId, date, emotion required" }, { status: 400 });
  }
  const date = new Date(`${dateStr}T00:00:00.000Z`);

  const saved = await prisma.emotionEntry.upsert({
    where: { childId_date: { childId: Number(childId), date } },
    update: { emotion, note: note ?? null },
    create: { childId: Number(childId), date, emotion, note: note ?? null },
  });

  return NextResponse.json(saved);
}
