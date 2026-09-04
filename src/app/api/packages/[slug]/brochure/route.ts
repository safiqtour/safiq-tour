import { NextResponse } from "next/server"
import { getPublicPackageBySlug } from "@/modules/public/packages"
import { getWhatsAppNumber } from "@/lib/whatsapp.server"
import { generatePackageBrochurePdf } from "@/lib/pdf/package-brochure"

export const dynamic = "force-dynamic"

/**
 * Sanitize the slug into a safe ASCII filename:
 * "zamzam-express" -> "zamzam-express-safiq-tour.pdf"
 */
function brochureFileName(slug: string): string {
  const safe = (slug ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
  return `${safe || "paket"}-safiq-tour.pdf`
}

/**
 * On-demand package brochure PDF.
 * GET /api/packages/[slug]/brochure
 *
 * Loads the published package by slug (getPublicPackageBySlug only exposes
 * PUBLISHED packages), renders a premium A4 brochure from its public content,
 * and returns it as an attachment named after the package slug.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params

    const pub = await getPublicPackageBySlug(slug)
    if (!pub) {
      return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 })
    }

    const whatsapp = await getWhatsAppNumber()

    const pdf = await generatePackageBrochurePdf(pub, whatsapp)
    const fileName = brochureFileName(pub.card.slug || slug)
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("[brochure] gagal generate PDF:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
