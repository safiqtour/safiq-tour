# Design System

STMS menggunakan **Shadcn/ui** sebagai base component library dengan kustomisasi untuk Safiq Tour branding.

## Platform

- **Framework**: Tailwind CSS 4
- **Components**: Shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Animations**: Framer Motion + tailwind-animate

## Design Principles

1. **Consistency** — Gunakan token yang sama di seluruh aplikasi
2. **Accessibility** — WCAG 2.1 AA minimum
3. **Responsive** — Mobile-first, semua komponen responsif
4. **Performance** — Minimal CSS, utility-first
5. **Brand Identity** — Warna dan tipografi mencerminkan Safiq Tour

## File Structure

`
components/
├── ui/           # Base UI (Shadcn generated)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   ├── badge.tsx
│   ├── skeleton.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── label.tsx
│   ├── separator.tsx
│   ├── container.tsx
│   ├── section.tsx
│   ├── textarea.tsx
│   └── field.tsx
└── shared/       # Shared app components
    ├── navbar.tsx
    ├── footer.tsx
    └── ...
`
"@ | Set-Content -Path "D:\test-safiq-iid\docs\06-ui\01-design-system.md" -Encoding UTF8

@"
# Color Palette

## Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| --primary | #0F5B2E | Hijau gelap (brand Safiq Tour) |
| --primary-foreground | #FFFFFF | Teks di atas primary |
| --primary-light | #1A7A3E | Hover state primary |
| --secondary | #C8A45C | Emas (premium accent) |
| --secondary-foreground | #1A1A1A | Teks di atas secondary |

## Neutral Colors

| Token | Value | Usage |
|-------|-------|-------|
| --background | #FFFFFF | Background utama |
| --foreground | #1A1A1A | Teks utama |
| --muted | #F5F5F5 | Background muted |
| --muted-foreground | #737373 | Teks muted |
| --card | #FFFFFF | Card background |
| --card-foreground | #1A1A1A | Card teks |
| --border | #E5E5E5 | Border color |
| --input | #E5E5E5 | Input border |

## Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| --success | #22C55E | Sukses / active |
| --warning | #F59E0B | Warning / pending |
| --error | #EF4444 | Error / danger |
| --info | #3B82F6 | Informasi |

## Dark Mode

Setiap token memiliki padanan dark mode dengan prefix dark:.
- Dark background: #1A1A1A
- Dark foreground: #F5F5F5
- Dark card: #2A2A2A
