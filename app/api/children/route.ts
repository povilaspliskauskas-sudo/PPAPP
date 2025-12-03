import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const count = await prisma.child.count();
  if (count === 0) {
    await prisma.child.createMany({
      data: [
        { name: 'Kid A', age: 6 },
        { name: 'Kid B', age: 3 },
        { name: 'Kid C', age: 1 },
      ],
    });
  }
  const children = await prisma.child.findMany({
    orderBy: { id: 'asc' },
  });
  return NextResponse.json(children);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body?.name || typeof body?.age !== 'number') {
    return NextResponse.json({ error: 'name (string) and age (number) required' }, { status: 400 });
  }
  const created = await prisma.child.create({ data: { name: body.name, age: body.age } });
  return NextResponse.json(created, { status: 201 });
}
