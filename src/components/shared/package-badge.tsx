import { cn } from "@/lib/utils"

const badgeStyles: Record<string, string> = {
  Popular: "bg-[#D4AF37] text-white",
  "Best Seller": "bg-[#0F2D5C] text-white",
  Recommended: "border-[#D4AF37] text-[#D4AF37] bg-transparent border",
  Special: "bg-emerald-600 text-white",
  Exclusive: "bg-gradient-to-r from-[#D4AF37] to-amber-600 text-white",
  Family: "bg-sky-600 text-white",
}

type PackageBadgeProps = {
  label: string
  className?: string
}

function PackageBadge({ label, className }: PackageBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        badgeStyles[label] || "bg-primary text-primary-foreground",
        className
      )}
    >
      {label}
    </span>
  )
}

export { PackageBadge }
