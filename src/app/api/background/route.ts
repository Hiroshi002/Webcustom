import { NextResponse } from "next/server";

const sourceUrl = "https://r.jina.ai/http://alphacoders.com/anime-girl-4k-wallpapers";
const refererUrl = "https://alphacoders.com/anime-girl-4k-wallpapers";

export async function GET(request: Request) {
  const response = await fetch(sourceUrl, {
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "text/html,application/xhtml+xml"
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { url: null },
      { status: 502, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  const html = await response.text();
  const matches = [
    ...html.matchAll(
      /https?:\/\/images\d*\.alphacoders\.com\/\d+\/thumbbig-\d+\.(?:jpg|png|webp)/g
    ),
  ];
  const urls = Array.from(new Set(matches.map((match) => match[0])));
  const url = urls[Math.floor(Math.random() * urls.length)];
  const { searchParams } = new URL(request.url);
  const asImage = searchParams.get("image") === "1";

  if (asImage) {
    if (!url) {
      return new NextResponse(null, {
        status: 404,
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    const imageResponse = await fetch(url, {
      cache: "no-store",
      headers: {
        Referer: refererUrl,
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!imageResponse.ok) {
      return new NextResponse(null, {
        status: 502,
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
    const buffer = await imageResponse.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  return NextResponse.json(
    { url: url ?? null },
    { status: url ? 200 : 404, headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
