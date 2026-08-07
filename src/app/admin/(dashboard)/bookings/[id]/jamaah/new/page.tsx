import { JamaahForm } from "@/components/admin/jamaah/jamaah-form"

export default async function NewJamaahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <JamaahForm bookingId={id} />
}
