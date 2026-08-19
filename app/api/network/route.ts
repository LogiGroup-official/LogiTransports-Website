import { NextRequest, NextResponse } from "next/server"
import { readNetworkData, writeNetworkData } from "@/lib/data"
import { isAdminRequest } from "@/lib/admin-auth"

export async function GET() {
  const data = await readNetworkData()
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 })
  }

  if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray((body as any).lines) ||
    !Array.isArray((body as any).news)
  ) {
    return NextResponse.json(
      { error: "Le corps doit contenir 'lines' et 'news'." },
      { status: 400 }
    )
  }

  await writeNetworkData(body as any)
  return NextResponse.json({ ok: true })
}
