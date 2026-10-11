import { NextResponse } from "next/server";
import { applicationStatus } from "../src/http/status";

export function GET() {
  return NextResponse.json(applicationStatus());
}
