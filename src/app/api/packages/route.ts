import { NextResponse } from "next/server"
import { db } from "@/lib/prisma/db"
import { requirePermission } from "@/modules/business/lib/permission"

export async function GET(request: Request) {
  try {
    await requirePermission("package:read")

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
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
          country: true,
          city: true,
          duration: true,
          price: true,
          promoPrice: true,
          discount: true,
          currency: true,
          airline: true,
          quota: true,
          seatFilled: true,
          status: true,
          featured: true,
          thumbnail: true,
          heroImage: true,
          createdAt: true,
          updatedAt: true,
          publishedAt: true,
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"

    if (message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.error("[api/packages] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
