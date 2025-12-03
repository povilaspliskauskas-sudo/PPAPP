import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.emotionEntry.findMany({
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { childId, date, emotion, notes } = body ?? {};
  if (!childId || !date || !emotion) {
    return NextResponse.json({ error: 'childId, date (ISO), emotion required' }, { status: 400 });
  }
  const created = await prisma.emotionEntry.create({
    data: {
      childId: Number(childId),
      date: new Date(date),
      emotion,
      notes: notes ?? null,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
