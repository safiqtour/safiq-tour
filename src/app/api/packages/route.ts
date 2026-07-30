import { NextResponse } from "next/server"
import { db } from "@/lib/prisma/db"
import { auth } from "@/lib/auth/auth"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") ?? ""
  const category = searchParams.get("category") ?? ""
  const status = searchParams.get("status") ?? ""
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize")) || 10))

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { country: { contains: search } },
      { airline: { contains: search } },
      { city: { contains: search } },
    ]
  }

  if (category) where.category = category
  if (status) where.status = status

  const [data, total] = await Promise.all([
    db.package.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        schedules: { select: { departureDate: true }, take: 1 },
      },
    }),
    db.package.count({ where }),
  ])

  return NextResponse.json({
    data: data.map((p) => ({
      ...p,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  })
}
