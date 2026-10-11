import { NextResponse } from "next/server";
import { healthStatus } from "../../../src/http/status";

export function GET() {
  return NextResponse.json(healthStatus());
}
