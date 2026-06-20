import { NextResponse } from "next/server";

import { getMarketResponse, MARKET_REVALIDATE_SECONDS } from "@/lib/api/market";

export async function GET() {
  const response = await getMarketResponse();
  const status = response.error ? resolveErrorStatus(response.error) : 200;

  return NextResponse.json(response, {
    status,
    headers: {
      "Cache-Control": `s-maxage=${MARKET_REVALIDATE_SECONDS}, stale-while-revalidate=${MARKET_REVALIDATE_SECONDS}`,
    },
  });
}

function resolveErrorStatus(message: string) {
  if (message.includes("timed out")) {
    return 504;
  }

  if (message.includes("rate-limited")) {
    return 429;
  }

  return 502;
}
