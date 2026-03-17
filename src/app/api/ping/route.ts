// app/api/ping/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const start = Date.now();
  const duration = Math.max(0, Date.now() - start);
  return NextResponse.json({
    status: 'pong',
    timestamp: Date.now(),
    region: 'STATION-01', // ชื่อสถานีสมมติให้ดูเท่
    version: '1.0.4-STABLE'
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0', // ป้องกันการจำค่าเก่าเพื่อให้ Ping แม่นยำที่สุด
      'Server-Timing': `app;dur=${duration}`,
    }
  });
}

export async function HEAD() {
  const start = Date.now();
  const duration = Math.max(0, Date.now() - start);
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Server-Timing': `app;dur=${duration}`,
    },
  });
}
