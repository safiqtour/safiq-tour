"use client"

import { useEffect, useRef, useState } from "react"

type AnimatedCounterProps = {
  value: number
  duration?: number
  suffix?: string
  formatNumber?: boolean
  className?: string
}

function AnimatedCounter({
  value,
  duration = 2000,
  suffix = "",
  formatNumber = false,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!ref.current || hasStarted.current) return
    hasStarted.current = true

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()

        function animate(now: number) {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - (1 - progress) * (1 - progress)
          setCount(Math.floor(eased * value))

          if (progress < 1) requestAnimationFrame(animate)
        }

        requestAnimationFrame(animate)
      },
      { threshold: 0.3 }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [value, duration])

  const display = formatNumber ? count.toLocaleString("id-ID") : count

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  )
}

export { AnimatedCounter }
