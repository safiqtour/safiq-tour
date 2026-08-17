import { NextResponse } from "next/server"
import { getPublicPackageBySlug } from "@/modules/public/packages"
import { getWhatsAppNumber } from "@/lib/whatsapp.server"
import { generatePackageBrochurePdf } from "@/lib/packages/brochure-generator"

export const dynamic = "force-dynamic"

/**
 * On-demand package brochure PDF.
 * GET /api/packages/[slug]/brochure
 *
 * Loads the published package by slug, renders a brochure from its public
 * content, and returns it as an attachment named after the package slug.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const pub = await getPublicPackageBySlug(slug)
  if (!pub) {
    return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 })
  }

  const whatsapp = await getWhatsAppNumber()

  try {
    const pdf = await generatePackageBrochurePdf(pub, whatsapp)
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pub.card.slug}.pdf"`,
      },
    })
  } catch (error) {
    console.error("[brochure] gagal generate PDF:", error)
    return NextResponse.json({ error: "Gagal membuat brosur. Silakan coba lagi." }, { status: 500 })
  }
}
