import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const items = await prisma.agendaItem.findMany({
    orderBy: [{ date: 'asc' }, { id: 'asc' }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { childId, date, title } = body ?? {};
  if (!childId || !date || !title) {
    return NextResponse.json({ error: 'childId, date (ISO), title required' }, { status: 400 });
  }
  const created = await prisma.agendaItem.create({
    data: { childId: Number(childId), date: new Date(date), title, done: false },
  });
  return NextResponse.json(created, { status: 201 });
}
