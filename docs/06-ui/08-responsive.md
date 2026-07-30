# Responsive Design

## Breakpoints (Tailwind defaults)

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop kecil |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large desktop |

## Mobile-First Approach

Semua style ditulis untuk mobile sebagai default, kemudian ditingkatkan untuk layar lebih besar.

`	sx
// Contoh: Grid responsif
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Contoh: Padding responsif
<div className="px-4 md:px-6 lg:px-8">

// Contoh: Typography responsif
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
`

## Admin Dashboard Layout

- **Mobile**: Single column, collapsible sidebar
- **Tablet**: Sidebar icons only
- **Desktop**: Sidebar with labels + main content
