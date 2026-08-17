"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { HotelWizard } from "@/components/admin/hospitality/hotel-wizard"

export default function NewHotelPage() {
  const router = useRouter()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">New Hotel</h1>
        <p className="text-sm text-[#9CA3AF]">Create a new hotel with the wizard</p>
      </div>
      <HotelWizard onSuccess={() => router.push("/admin/hospitality/hotels")} onCancel={() => router.push("/admin/hospitality/hotels")} />
    </motion.div>
  )
}
