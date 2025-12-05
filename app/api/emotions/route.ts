import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * We accept these emotion keys from the UI and store them verbatim.
 * This avoids importing Prisma's enum types and keeps TS happy during build.
 */
const EMOTIONS = ["happy","calm","excited","neutral","sad","angry","tired"] as const;
type Emotion = typeof EMOTIONS[number];

function isEmotion(v: unknown): v is Emotion {
  return typeof v === "string" && EMOTIONS.includes(v as Emotion);
}

// Helpers
function toStartOfUTCDate(d: Date) {
  const copy = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  return copy;
}
function ymd(date: Date) {
  return date.toISOString().slice(0,10); // YYYY-MM-DD (UTC)
}
function hm(date: Date) {
  return date.toISOString().slice(11,16); // HH:MM (UTC)
}

/** POST /api/emotions  Body: { childId:number, emotion:Emotion, date?:YYYY-MM-DD } */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const childId = Number(body?.childId);
    const emotionRaw = body?.emotion;

    if (!childId || !isEmotion(emotionRaw)) {
      return NextResponse.json(
        { error: "Invalid body. Expect { childId:number, emotion: one of "+EMOTIONS.join(", ")+" }" },
        { status: 400 }
      );
    }

    // If client passes a date, use it (UTC start-of-day); else use now's day.
    const dateStr: string | undefined = typeof body?.date === "string" ? body.date : undefined;
    const date = dateStr ? toStartOfUTCDate(new Date(dateStr+"T00:00:00.000Z")) : toStartOfUTCDate(new Date());

    // Create a NEW entry for every press (no toggling!)
    const saved = await prisma.emotionEntry.create({
      data: {
        childId,
        date,          // day bucket
        emotion: emotionRaw, // store as string; Prisma will validate against DB enum
        // note?: optional — we omit for now per your request
      },
      select: { id:true, childId:true, date:true, emotion:true, createdAt:true, note:true }
    });

    return NextResponse.json({
      id: saved.id,
      childId: saved.childId,
      date: ymd(saved.date),          // YYYY-MM-DD
      time: hm(saved.createdAt),      // HH:MM
      emotion: saved.emotion,
      createdAt: saved.createdAt,
      note: saved.note ?? null
    });
  } catch (e) {
    return NextResponse.json({ error: "Server error", detail: String(e) }, { status: 500 });
  }
}

/**
 * GET /api/emotions?childId=1&from=YYYY-MM-DD&days=30&emotion=happy|calm|...|all
 * Returns chronological entries with date + time strings.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const childId = Number(searchParams.get("childId"));
    const fromStr = searchParams.get("from") ?? new Date().toISOString().slice(0,10);
    const days = Number(searchParams.get("days") ?? 30);
    const emotionFilter = searchParams.get("emotion") ?? "all";

    if (!childId) {
      return NextResponse.json({ items: [] }); // nothing to do
    }

    const from = toStartOfUTCDate(new Date(fromStr+"T00:00:00.000Z"));
    const until = new Date(from); // from + (days - 1)
    until.setUTCDate(until.getUTCDate() + Math.max(1, days));

    const where: any = {
      childId,
      createdAt: { gte: from, lt: until },
    };
    if (emotionFilter !== "all" && isEmotion(emotionFilter)) {
      where.emotion = emotionFilter;
    }

    const rows = await prisma.emotionEntry.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      select: { id:true, date:true, emotion:true, createdAt:true, note:true },
    });

    const items = rows.map(r => ({
      id: r.id,
      date: ymd(r.date),
      time: hm(r.createdAt),
      emotion: r.emotion,
      createdAt: r.createdAt,
      note: r.note ?? null,
    }));

    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ error: "Server error", detail: String(e) }, { status: 500 });
  }
}
