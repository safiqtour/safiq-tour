import { cn } from "@/lib/utils"

type PackageCTAProps = {
  className?: string
}

function PackageCTA({ className }: PackageCTAProps) {
  return (
    <button
      className={cn(
        "w-full cursor-pointer rounded-xl bg-[#0F2D5C] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1a3d7a] hover:shadow-lg hover:shadow-[#0F2D5C]/20 active:scale-[0.98]",
        className
      )}
    >
      Lihat Detail
    </button>
  )
}

export { PackageCTA }
