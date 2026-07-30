# Animation

Platform menggunakan **Framer Motion** + **tailwind-animate** untuk animasi.

## Tailwind Animations

| Class | Duration | Usage |
|-------|----------|-------|
| animate-in | 300ms | Entry animation |
| animate-out | 200ms | Exit animation |
| fade-in | 300ms | Fade in |
| fade-out | 200ms | Fade out |
| slide-in | 300ms | Slide in |
| slide-out | 200ms | Slide out |
| zoom-in | 300ms | Zoom in |
| zoom-out | 200ms | Zoom out |

## Framer Motion Variants

`	ypescript
// Page transition
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

// Stagger children
const staggerVariants = {
  animate: { transition: { staggerChildren: 0.1 } }
}

// Card hover
const cardHover = {
  whileHover: { y: -4, transition: { duration: 0.2 } }
}
`

## Animation Principles

1. Duration 200-300ms untuk micro-interactions
2. Duration 300-500ms untuk page transitions
3. Ease-in-out untuk natural feel
4. Hindari animasi berlebihan (aksesibilitas)
5. Respect prefers-reduced-motion
