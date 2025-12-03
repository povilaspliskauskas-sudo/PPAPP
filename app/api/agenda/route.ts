import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/agenda?childId=1&date=YYYY-MM-DD */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const childId = Number(searchParams.get("childId"));
  const dateStr = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  if (!childId) return NextResponse.json({ error: "childId is required" }, { status: 400 });

  const date = new Date(`${dateStr}T00:00:00.000Z`);

  const items = await prisma.event.findMany({
    where: { childId, date },
    select: { id: true, title: true, icon: true },
    orderBy: { id: "asc" },
  });

  return NextResponse.json({ items });
}

/** 
 * POST /api/agenda
 * Body: { childId:number, date:string(YYYY-MM-DD), task:{ key, label, icon, slot } }
 * Toggle: if row with title==task.key exists → delete, else create.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { childId, date: dateStr, task } = body || {};
  if (!childId || !dateStr || !task?.key) {
    return NextResponse.json({ error: "childId, date, and task.key are required" }, { status: 400 });
  }
  const date = new Date(`${dateStr}T00:00:00.000Z`);

  const existing = await prisma.event.findFirst({
    where: { childId: Number(childId), date, title: String(task.key) },
    select: { id: true },
  });

  if (existing) {
    await prisma.event.delete({ where: { id: existing.id } });
  } else {
    await prisma.event.create({
      data: {
        childId: Number(childId),
        date,
        title: String(task.key),
        icon: String(task.icon ?? ""),
      },
    });
  }

  const items = await prisma.event.findMany({
    where: { childId: Number(childId), date },
    select: { id: true, title: true, icon: true },
    orderBy: { id: "asc" },
  });

  return NextResponse.json({ items, toggled: task.key, checked: !existing });
}
