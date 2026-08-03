"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getPilgrim } from "@/modules/pilgrim/actions/pilgrim"
import { CustomerForm, type CustomerFormData, type CustomerDocumentDraft } from "../../_components/customer-form"

export default function EditCustomerPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [initial, setInitial] = useState<CustomerFormData | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    getPilgrim(params.id as string)
      .then((res) => {
        if (!res) { setError("Customer tidak ditemukan"); return }
        const documents: CustomerDocumentDraft[] = (res.documents ?? []).map((d) => ({
          id: d.id,
          type: d.type,
          status: d.status,
          mediaId: d.mediaId,
          notes: d.notes,
        }))
        setInitial({
          id: res.id,
          name: res.name,
          nickName: res.nickName,
          email: res.email,
          phone: res.phone,
          gender: res.gender,
          birthPlace: res.birthPlace,
          birthDate: res.birthDate,
          address: res.address,
          nationality: res.nationality,
          nik: res.nik,
          passportNumber: res.passportNumber,
          passportExpiry: res.passportExpiry,
          photoMediaId: res.photoMediaId,
          status: res.status,
          notes: res.notes,
          documents,
        })
      })
      .catch(() => setError("Gagal memuat data customer"))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" />
      </div>
    )
  }

  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>

  return <CustomerForm mode="edit" initial={initial} />
}
