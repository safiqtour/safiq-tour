import { cn } from "@/lib/utils"
import { formatPrice } from "@/data/packages"

type PackagePriceProps = {
  price: number
  label?: string
  className?: string
}

function PackagePrice({ price, label, className }: PackagePriceProps) {
  return (
    <div className={cn("space-y-0.5", className)}>
      {label && (
        <p className="text-xs text-muted-foreground">{label}</p>
      )}
      <p className="text-2xl font-bold tracking-tight text-[#0F2D5C]">
        {formatPrice(price)}
      </p>
    </div>
  )
}

export { PackagePrice }
