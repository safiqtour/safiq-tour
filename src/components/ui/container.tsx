import { cn } from "@/lib/utils"

type ContainerSize = "sm" | "md" | "lg" | "xl" | "wide" | "full"

type ContainerProps = React.ComponentProps<"div"> & {
  size?: ContainerSize
}

const containerStyles: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-(--container-max)",
  wide: "max-w-(--container-wide)",
  full: "max-w-full",
}

function Container({
  className,
  size = "xl",
  ...props
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full px-3 sm:px-6 lg:px-8",
        containerStyles[size],
        className
      )}
      {...props}
    />
  )
}

export { Container, type ContainerProps, type ContainerSize }
