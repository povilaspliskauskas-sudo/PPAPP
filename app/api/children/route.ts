import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Seeds 3 kids (6y, 3y, 1y) if table is empty.
 * Why: makes first-run verification easy.
 */
async function ensureSeed() {
  const count = await prisma.child.count();
  if (count === 0) {
    await prisma.child.createMany({
      data: [
        { name: "Kid A", age: 6 },
        { name: "Kid B", age: 3 },
        { name: "Kid C", age: 1 },
      ],
    });
  }
}

export async function GET() {
  await ensureSeed();
  const kids = await prisma.child.findMany({
    orderBy: { age: "desc" },
  });
  return NextResponse.json(kids);
}
