import { NextRequest, NextResponse } from "next/server";

const parseMaintenance = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true" || value === "1";
  if (typeof value === "number") return value === 1;
  return false;
};

const isAllowedPath = (pathname: string) => {
  if (pathname.startsWith("/maintenance")) return true;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;
  return false;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  let isMaintenance = false;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/system_config?key=eq.is_maintenance&select=value&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: "no-store",
      }
    );

    if (response.ok) {
      const data = (await response.json()) as Array<{ value?: unknown }>;
      isMaintenance = parseMaintenance(data?.[0]?.value);
    }
  } catch {
    return NextResponse.next();
  }

  if (isMaintenance && !isAllowedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  if (!isMaintenance && pathname.startsWith("/maintenance")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
