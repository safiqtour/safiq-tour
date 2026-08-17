import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedCounter } from "@/components/shared/animated-counter"

type StatItemProps = {
  icon: LucideIcon
  value: number
  label: string
  suffix?: string
  formatNumber?: boolean
  className?: string
}

function StatItem({
  icon: Icon,
  value,
  label,
  suffix,
  formatNumber,
  className,
}: StatItemProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <Icon className="size-8 text-brand-600" />
      <AnimatedCounter
        value={value}
        suffix={suffix}
        formatNumber={formatNumber}
        className="text-4xl font-bold text-brand-600 tabular-nums"
      />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export { StatItem }
