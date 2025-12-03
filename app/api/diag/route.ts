import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    ok: true,
    env: {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    },
    time: new Date().toISOString(),
  });
}
