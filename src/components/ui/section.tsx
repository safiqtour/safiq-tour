import { cn } from "@/lib/utils"
import { Container, type ContainerSize } from "@/components/ui/container"

type SectionVariant = "default" | "muted" | "brand" | "brand-muted"

type SectionProps = React.ComponentProps<"section"> & {
  variant?: SectionVariant
  size?: "default" | "sm"
  containerSize?: ContainerSize
  disableContainer?: boolean
}

const sectionStyles: Record<SectionVariant, string> = {
  default: "bg-background",
  muted: "bg-muted",
  brand: "bg-brand-600 text-brand-50",
  "brand-muted": "bg-brand-50",
}

function Section({
  className,
  variant = "default",
  size = "default",
  containerSize,
  disableContainer,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      data-variant={variant}
      className={cn(
        size === "sm"
          ? "py-(--spacing-section-sm)"
          : "py-(--spacing-section-sm) md:py-(--spacing-section)",
        sectionStyles[variant],
        className
      )}
      {...props}
    >
      {disableContainer ? (
        children
      ) : (
        <Container size={containerSize}>{children}</Container>
      )}
    </section>
  )
}

function SectionHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-header"
      className={cn(
        "mb-8 max-w-2xl space-y-2 md:mb-10",
        className
      )}
      {...props}
    />
  )
}

function SectionTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="section-title"
      className={cn(
        "text-2xl font-semibold leading-tight tracking-tight md:text-3xl",
        className
      )}
      {...props}
    />
  )
}

function SectionDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="section-description"
      className={cn(
        "text-base text-muted-foreground md:text-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  type SectionProps,
  type SectionVariant,
}
