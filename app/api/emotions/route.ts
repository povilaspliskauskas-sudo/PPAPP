import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/emotions?childId=1&from=YYYY-MM-DD&days=30&emotion=all|happy|calm|...
 * Returns: { items: [{ id, date, time, emotion, note }] }
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const childId = Number(searchParams.get("childId"));
    const fromStr = searchParams.get("from") || new Date().toISOString().slice(0, 10);
    const days = Math.max(1, Math.min(90, Number(searchParams.get("days")) || 30));
    const emotionParam = (searchParams.get("emotion") || "all").toLowerCase();

    if (!childId) {
      return NextResponse.json({ error: "childId is required" }, { status: 400 });
    }

    // date range (UTC day)
    const start = new Date(`${fromStr}T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + days); // [start, end)

    // Optional emotion filter; ignore if "all"
    const allowed = new Set(["happy","calm","excited","neutral","sad","angry","tired"]);
    const whereEmotion =
      emotionParam !== "all" && allowed.has(emotionParam)
        ? { emotion: emotionParam as any } // enum in schema is lower-case values
        : {};

    // Prefer filtering by createdAt range; also include "date" if you store per-day
    const items = await prisma.emotionEntry.findMany({
      where: {
        childId,
        createdAt: { gte: start, lt: end },
        ...whereEmotion,
      },
      select: { id: true, emotion: true, note: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 500, // safety
    });

    const mapped = items.map((it) => {
      const iso = it.createdAt.toISOString();
      return {
        id: it.id,
        emotion: it.emotion,
        note: it.note,
        date: iso.slice(0, 10),
        time: iso.slice(11, 19),
      };
    });

    return NextResponse.json({ items: mapped });
  } catch (e) {
    console.error("GET /api/emotions failed", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

/**
 * POST /api/emotions
 * { childId:number, emotion:string }
 * Returns: the saved row
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const childId = Number(body?.childId);
    const emotion = String(body?.emotion || "").toLowerCase();

    if (!childId) {
      return NextResponse.json({ error: "childId is required" }, { status: 400 });
    }

    const allowed = new Set(["happy","calm","excited","neutral","sad","angry","tired"]);
    if (!allowed.has(emotion)) {
      return NextResponse.json({ error: "invalid emotion" }, { status: 400 });
    }

    // Store with current UTC date and timestamp
    const now = new Date();
    const todayUTC = new Date(now.toISOString().slice(0, 10) + "T00:00:00.000Z");

    const saved = await prisma.emotionEntry.create({
      data: { childId, date: todayUTC as any, emotion: emotion as any, note: null },
      select: { id: true, childId: true, date: true, emotion: true, note: true, createdAt: true },
    });

    // Return the simplified shape UI expects
    const iso = saved.createdAt.toISOString();
    return NextResponse.json({
      id: saved.id,
      date: iso.slice(0, 10),
      time: iso.slice(11, 19),
      emotion: saved.emotion,
      note: saved.note,
    });
  } catch (e) {
    console.error("POST /api/emotions failed", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
