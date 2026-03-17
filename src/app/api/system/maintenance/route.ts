import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const parseMaintenance = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true" || value === "1";
  if (typeof value === "number") return value === 1;
  return false;
};

const getServiceHeaders = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;
  return {
    supabaseUrl,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
  };
};

export async function GET() {
  const service = getServiceHeaders();
  if (!service) {
    return NextResponse.json({ ok: false, error: "MISSING_SUPABASE_SERVICE_KEY" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `${service.supabaseUrl}/rest/v1/system_config?key=eq.is_maintenance&select=value&limit=1`,
      { headers: service.headers, cache: "no-store" }
    );
    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: "SUPABASE_GET_FAILED", status: response.status },
        { status: 500 }
      );
    }
    const data = (await response.json()) as Array<{ value?: unknown }>;
    const value = parseMaintenance(data?.[0]?.value);
    return NextResponse.json({ ok: true, value });
  } catch {
    return NextResponse.json({ ok: false, error: "SUPABASE_GET_EXCEPTION" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const service = getServiceHeaders();
  if (!service) {
    return NextResponse.json({ ok: false, error: "MISSING_SUPABASE_SERVICE_KEY" }, { status: 500 });
  }

  let body: { value?: unknown } | null = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const value = parseMaintenance(body?.value);

  try {
    const patchResponse = await fetch(
      `${service.supabaseUrl}/rest/v1/system_config?key=eq.is_maintenance`,
      {
        method: "PATCH",
        headers: {
          ...service.headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ value }),
      }
    );
    if (!patchResponse.ok) {
      return NextResponse.json(
        { ok: false, error: "SUPABASE_PATCH_FAILED", status: patchResponse.status },
        { status: 500 }
      );
    }
    let patched: Array<{ value?: unknown }> = [];
    try {
      patched = (await patchResponse.json()) as Array<{ value?: unknown }>;
    } catch {
      patched = [];
    }
    if (patched.length > 0) {
      return NextResponse.json({ ok: true, value: parseMaintenance(patched[0]?.value ?? value) });
    }

    const insertResponse = await fetch(
      `${service.supabaseUrl}/rest/v1/system_config`,
      {
        method: "POST",
        headers: {
          ...service.headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ key: "is_maintenance", value }),
      }
    );
    if (!insertResponse.ok) {
      return NextResponse.json(
        { ok: false, error: "SUPABASE_INSERT_FAILED", status: insertResponse.status },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, value });
  } catch {
    return NextResponse.json({ ok: false, error: "SUPABASE_POST_EXCEPTION" }, { status: 500 });
  }
}
