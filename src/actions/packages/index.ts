"use server"

import { db } from "@/lib/prisma/db"
import { getSession } from "@/services/auth.integration.service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { packageFormSchema } from "@/lib/packages/schema"
import { slugify } from "@/lib/packages/utils"
import type { PackageStatus } from "@/lib/packages/types"

export async function getPackages(params: {
  search?: string
  category?: string
  status?: string
  page?: number
  pageSize?: number
}) {
  const session = await getSession()
  if (!session?.user?.id) return { data: [], total: 0, page: 1, totalPages: 1 }

  const { search = "", category = "", status = "", page = 1, pageSize = 10 } = params

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { country: { contains: search } },
      { airline: { contains: search } },
      { city: { contains: search } },
    ]
  }

  if (category) {
    where.category = category
  }

  if (status) {
    where.status = status
  }

  const [data, total] = await Promise.all([
    db.package.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        hotels: true,
        schedules: true,
        facilities: true,
        itineraries: { orderBy: { day: "asc" } },
        galleries: { orderBy: { sortOrder: "asc" } },
      },
    }),
    db.package.count({ where }),
  ])

  return {
    data: data.map((p) => ({
      ...p,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getPackageById(id: string) {
  const session = await getSession()
  if (!session?.user?.id) return null

  const pkg = await db.package.findUnique({
    where: { id },
    include: {
      hotels: true,
      schedules: true,
      facilities: true,
      itineraries: { orderBy: { day: "asc" } },
      galleries: { orderBy: { sortOrder: "asc" } },
    },
  })

  if (!pkg) return null

  return {
    ...pkg,
    publishedAt: pkg.publishedAt?.toISOString() ?? null,
    createdAt: pkg.createdAt.toISOString(),
    updatedAt: pkg.updatedAt.toISOString(),
  }
}

export async function createPackage(formData: FormData) {
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const raw: Record<string, unknown> = {
    title: formData.get("title"),
    slug: formData.get("slug") || slugify(formData.get("title") as string),
    excerpt: formData.get("excerpt"),
    description: formData.get("description") ?? "",
    category: formData.get("category") ?? "REGULAR",
    country: formData.get("country"),
    city: formData.get("city"),
    duration: formData.get("duration") ? Number(formData.get("duration")) : 0,
    price: formData.get("price") ? Number(formData.get("price")) : 0,
    promoPrice: formData.get("promoPrice") ? Number(formData.get("promoPrice")) : null,
    discount: formData.get("discount") ? Number(formData.get("discount")) : 0,
    currency: formData.get("currency") ?? "IDR",
    airline: formData.get("airline"),
    quota: formData.get("quota") ? Number(formData.get("quota")) : 0,
    seatFilled: formData.get("seatFilled") ? Number(formData.get("seatFilled")) : 0,
    status: formData.get("status") ?? "DRAFT",
    featured: formData.get("featured") === "true",
    badge: formData.get("badge") || null,
    thumbnail: formData.get("thumbnail") ?? "",
    heroImage: formData.get("heroImage") ?? "",
    metaTitle: formData.get("metaTitle") ?? "",
    metaDescription: formData.get("metaDescription") ?? "",
    keywords: formData.get("keywords") ?? "",
    hotels: formData.get("hotels") ? JSON.parse(formData.get("hotels") as string) : [],
    schedules: formData.get("schedules") ? JSON.parse(formData.get("schedules") as string) : [],
    facilities: formData.get("facilities") ? JSON.parse(formData.get("facilities") as string) : [],
    itineraries: formData.get("itineraries") ? JSON.parse(formData.get("itineraries") as string) : [],
    galleries: formData.get("galleries") ? JSON.parse(formData.get("galleries") as string) : [],
  }

  const parsed = packageFormSchema.parse(raw)

  await db.package.create({
    data: {
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt,
      description: parsed.description,
      category: parsed.category,
      country: parsed.country,
      city: parsed.city,
      duration: parsed.duration,
      price: parsed.price,
      promoPrice: parsed.promoPrice,
      discount: parsed.discount,
      currency: parsed.currency,
      airline: parsed.airline,
      quota: parsed.quota,
      seatFilled: parsed.seatFilled,
      status: parsed.status,
      featured: parsed.featured,
      badge: parsed.badge,
      thumbnail: parsed.thumbnail,
      heroImage: parsed.heroImage,
      metaTitle: parsed.metaTitle,
      metaDescription: parsed.metaDescription,
      keywords: parsed.keywords,
      publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
      hotels: {
        create: parsed.hotels,
      },
      schedules: {
        create: parsed.schedules.map((s) => ({
          departureDate: new Date(s.departureDate),
          returnDate: s.returnDate ? new Date(s.returnDate) : null,
          meetingPoint: s.meetingPoint,
          seat: s.seat,
          seatFilled: s.seatFilled,
        })),
      },
      facilities: {
        create: parsed.facilities,
      },
      itineraries: {
        create: parsed.itineraries,
      },
      galleries: {
        create: parsed.galleries,
      },
    },
  })

  revalidatePath("/admin/packages")
  redirect("/admin/packages")
}

export async function updatePackage(id: string, formData: FormData) {
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const raw: Record<string, unknown> = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    description: formData.get("description") ?? "",
    category: formData.get("category") ?? "REGULAR",
    country: formData.get("country"),
    city: formData.get("city"),
    duration: formData.get("duration") ? Number(formData.get("duration")) : 0,
    price: formData.get("price") ? Number(formData.get("price")) : 0,
    promoPrice: formData.get("promoPrice") ? Number(formData.get("promoPrice")) : null,
    discount: formData.get("discount") ? Number(formData.get("discount")) : 0,
    currency: formData.get("currency") ?? "IDR",
    airline: formData.get("airline"),
    quota: formData.get("quota") ? Number(formData.get("quota")) : 0,
    seatFilled: formData.get("seatFilled") ? Number(formData.get("seatFilled")) : 0,
    status: formData.get("status") ?? "DRAFT",
    featured: formData.get("featured") === "true",
    badge: formData.get("badge") || null,
    thumbnail: formData.get("thumbnail") ?? "",
    heroImage: formData.get("heroImage") ?? "",
    metaTitle: formData.get("metaTitle") ?? "",
    metaDescription: formData.get("metaDescription") ?? "",
    keywords: formData.get("keywords") ?? "",
    hotels: formData.get("hotels") ? JSON.parse(formData.get("hotels") as string) : [],
    schedules: formData.get("schedules") ? JSON.parse(formData.get("schedules") as string) : [],
    facilities: formData.get("facilities") ? JSON.parse(formData.get("facilities") as string) : [],
    itineraries: formData.get("itineraries") ? JSON.parse(formData.get("itineraries") as string) : [],
    galleries: formData.get("galleries") ? JSON.parse(formData.get("galleries") as string) : [],
  }

  const parsed = packageFormSchema.parse(raw)

  await db.$transaction(async (tx) => {
    await tx.packageHotel.deleteMany({ where: { packageId: id } })
    await tx.packageSchedule.deleteMany({ where: { packageId: id } })
    await tx.packageFacility.deleteMany({ where: { packageId: id } })
    await tx.packageItinerary.deleteMany({ where: { packageId: id } })
    await tx.packageGallery.deleteMany({ where: { packageId: id } })

    await tx.package.update({
      where: { id },
      data: {
        title: parsed.title,
        slug: parsed.slug,
        excerpt: parsed.excerpt,
        description: parsed.description,
        category: parsed.category,
        country: parsed.country,
        city: parsed.city,
        duration: parsed.duration,
        price: parsed.price,
        promoPrice: parsed.promoPrice,
        discount: parsed.discount,
        currency: parsed.currency,
        airline: parsed.airline,
        quota: parsed.quota,
        seatFilled: parsed.seatFilled,
        status: parsed.status,
        featured: parsed.featured,
        badge: parsed.badge,
        thumbnail: parsed.thumbnail,
        heroImage: parsed.heroImage,
        metaTitle: parsed.metaTitle,
        metaDescription: parsed.metaDescription,
        keywords: parsed.keywords,
        publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
        hotels: {
          create: parsed.hotels,
        },
        schedules: {
          create: parsed.schedules.map((s) => ({
            departureDate: new Date(s.departureDate),
            returnDate: s.returnDate ? new Date(s.returnDate) : null,
            meetingPoint: s.meetingPoint,
            seat: s.seat,
            seatFilled: s.seatFilled,
          })),
        },
        facilities: {
          create: parsed.facilities,
        },
        itineraries: {
          create: parsed.itineraries,
        },
        galleries: {
          create: parsed.galleries,
        },
      },
    })
  })

  revalidatePath("/admin/packages")
  redirect("/admin/packages")
}

export async function deletePackage(id: string) {
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.package.delete({ where: { id } })
  revalidatePath("/admin/packages")
}

export async function duplicatePackage(id: string) {
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const original = await db.package.findUnique({
    where: { id },
    include: {
      hotels: true,
      schedules: true,
      facilities: true,
      itineraries: true,
      galleries: true,
    },
  })

  if (!original) throw new Error("Package not found")

  const newSlug = `${original.slug}-copy`
  const newTitle = `${original.title} (Copy)`

  await db.package.create({
    data: {
      title: newTitle,
      slug: newSlug,
      excerpt: original.excerpt,
      description: original.description,
      category: original.category,
      country: original.country,
      city: original.city,
      duration: original.duration,
      price: original.price,
      promoPrice: original.promoPrice,
      discount: original.discount,
      currency: original.currency,
      airline: original.airline,
      quota: original.quota,
      seatFilled: 0,
      status: "DRAFT",
      featured: false,
      badge: null,
      thumbnail: original.thumbnail,
      heroImage: original.heroImage,
      metaTitle: original.metaTitle,
      metaDescription: original.metaDescription,
      keywords: original.keywords,
      hotels: { create: original.hotels.map((h) => ({ type: h.type, name: h.name, stars: h.stars, distance: h.distance, mapsUrl: h.mapsUrl, image: h.image })) },
      schedules: { create: original.schedules.map((s) => ({ departureDate: s.departureDate, returnDate: s.returnDate, meetingPoint: s.meetingPoint, seat: s.seat, seatFilled: 0 })) },
      facilities: { create: original.facilities.map((f) => ({ name: f.name, icon: f.icon })) },
      itineraries: { create: original.itineraries.map((i) => ({ day: i.day, title: i.title, description: i.description, image: i.image })) },
      galleries: { create: original.galleries.map((g) => ({ url: g.url, alt: g.alt, sortOrder: g.sortOrder })) },
    },
  })

  revalidatePath("/admin/packages")
}

export async function updatePackageStatus(id: string, status: PackageStatus) {
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.package.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  })

  revalidatePath("/admin/packages")
}

export async function toggleFeatured(id: string, featured: boolean) {
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.package.update({ where: { id }, data: { featured } })
  revalidatePath("/admin/packages")
}
