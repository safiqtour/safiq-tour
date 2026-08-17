import { cn } from "@/lib/utils"

type PackageFeaturesProps = {
  features: string[]
  className?: string
}

function PackageFeatures({ features, className }: PackageFeaturesProps) {
  return (
    <ul className={cn("space-y-2", className)}>
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          {feature}
        </li>
      ))}
    </ul>
  )
}

export { PackageFeatures }
