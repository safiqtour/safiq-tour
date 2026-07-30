# Design System

STMS menggunakan **Shadcn/ui** sebagai base component library dengan kustomisasi branding Safiq Tour.

## Platform
- Framework: Tailwind CSS 4
- Components: Shadcn/ui (Radix UI primitives)
- Icons: Lucide React
- Animations: Framer Motion + tailwind-animate

## Design Principles
1. Consistency — Gunakan token yang sama di seluruh aplikasi
2. Accessibility — WCAG 2.1 AA minimum
3. Responsive — Mobile-first
4. Performance — Utility-first CSS
5. Brand Identity — Warna & tipografi mencerminkan Safiq Tour

## File Structure
```
components/
├── ui/              # Shadcn generated (button, input, card, dialog, dll)
└── shared/          # Shared app components (navbar, footer, dll)
```
