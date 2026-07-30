# Security — XSS Prevention

## Strategy
- React/Next.js auto-escapes output by default
- Jangan gunakan dangerouslySetInnerHTML tanpa sanitasi
- Untuk konten rich text, gunakan Tiptap dengan sanitasi output

## Specific Rules
1. **No dangerouslySetInnerHTML** — Gunakan komponen HTML yang sudah disanitasi
2. **Rich text content** — Sanitasi output sebelum render (DOMPurify)
3. **User-generated content** — Escape sebelum tampil
4. **URL validation** — Pastikan URL tidak mengandung javascript:
5. **Form input** — Zod validation sudah mencegah input berbahaya

## HTML Sanitization
```
// Jika terpaksa menggunakan innerHTML
import DOMPurify from "isomorphic-dompurify"

function SanitizedHTML({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
}
```
