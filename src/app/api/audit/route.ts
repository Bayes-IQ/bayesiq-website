import { NextRequest, NextResponse } from "next/server";

const AUDIT_API_URL =
  process.env.AUDIT_API_URL ?? "http://localhost:8000";
const AUDIT_API_KEY = process.env.BAYESIQ_API_KEY ?? "";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No CSV file provided." },
        { status: 400 }
      );
    }

    // Forward to audit API
    const proxyForm = new FormData();
    proxyForm.append("file", file);

    const headers: Record<string, string> = {};
    if (AUDIT_API_KEY) {
      headers["Authorization"] = `Bearer ${AUDIT_API_KEY}`;
    }

    const response = await fetch(`${AUDIT_API_URL}/audit`, {
      method: "POST",
      body: proxyForm,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail ?? "Audit failed." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Audit service unavailable. Try again later." },
      { status: 503 }
    );
  }
}
