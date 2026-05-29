import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SIMULATION_COOKIE_NAME } from "@/lib/simulation-config";
import { getQuotaFromCookieValue } from "@/lib/simulation-usage";

export async function GET() {
  const jar = await cookies();
  const quota = getQuotaFromCookieValue(jar.get(SIMULATION_COOKIE_NAME)?.value);
  return NextResponse.json(quota);
}
