# Reusable Component Rules

## Criteria
Komponen boleh reusable jika:
- Digunakan di 2+ tempat berbeda
- Props jelas dan terdokumentasi
- Tidak terikat business logic spesifik

## Props
`	sx
// Good
interface ButtonProps {
  variant: "primary" | "secondary" | "ghost"
  size: "sm" | "md" | "lg"
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

// Bad
interface ButtonProps {
  [key: string]: any
}
`

## Composition over Configuration
`	sx
// Good
<Card>
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent>Content</CardContent>
</Card>
`

## Variants (CVA)
`	sx
const buttonVariants = cva("base-class", {
  variants: {
    variant: { primary: "bg-primary", secondary: "bg-secondary" },
    size: { sm: "text-sm", md: "text-base" }
  }
})
`

## Accessibility
- Role yang sesuai
- Keyboard navigation
- aria-label jika icon-only
- Focus ring
