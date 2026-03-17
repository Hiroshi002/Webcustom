// app/api/discord/stats/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // วิธีดึงข้อมูลแบบไม่ต้องใช้ Discord.js Client (ลดปัญหา Build Error และเร็วกว่า)
    // ใช้ Widget API หรือดึงจาก Guild Preview API
    const guildId = process.env.DISCORD_GUILD_ID;

    // ดึงข้อมูลผ่าน REST API โดยตรง (ต้องตั้งค่า Guild เป็น Public หรือใช้ Bot Token)
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 60 } // Cache ไว้ 1 นาที
    });

    const data = await response.json();

    return NextResponse.json({
      total: data.approximate_member_count || 0,
      online: data.approximate_presence_count || 0
    });
  } catch (error) {
    console.error("Discord Stats Error:", error);
    return NextResponse.json({ total: 0, online: 0 }, { status: 500 });
  }
}
