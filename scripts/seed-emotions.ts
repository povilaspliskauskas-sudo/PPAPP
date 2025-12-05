import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const EMOJIS = ["happy","calm","excited","neutral","sad","angry","tired"] as const;
type EmotionKey = typeof EMOJIS[number];

const toEnum = (k: EmotionKey) => k.toUpperCase() as unknown as any;

async function main() {
  const childA = await prisma.child.findFirst({ where: { name: "Kid A" } });
  if (!childA) { console.log("Kid A not found"); return; }

  const now = new Date();
  for (let i = 0; i < 8; i++) {
    const e = EMOJIS[i % EMOJIS.length];
    const createdAt = new Date(now.getTime() - i * 60 * 60 * 1000); // every hour back
    const dateOnly = new Date(`${createdAt.toISOString().slice(0,10)}T00:00:00.000Z`);

    // Use $executeRaw to set createdAt explicitly for demos
    await prisma.$executeRawUnsafe(
      `INSERT INTO "EmotionEntry" ("childId","date","emotion","note","createdAt")
       VALUES ($1,$2,$3,$4,$5)`,
      childA.id, dateOnly, toEnum(e), null, createdAt
    );
  }
  console.log("Seeded some emotion history for Kid A.");
}

main().finally(() => prisma.$disconnect());
