import Link from "next/link"

const FOOTER_LINKS = [
  {
    title: "Navigation",
    items: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Packages", href: "/packages" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const

function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="mx-auto w-full max-w-(--container-max) px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <Link
              href="/"
              className="font-heading text-lg font-semibold tracking-tight"
            >
              Safiq Tour
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for Umrah travel.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Phone: +62 123 4567 8910</li>
              <li>Email: info@safiqtour.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Safiq Tour. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
