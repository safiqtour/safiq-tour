"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Packages", href: "/packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-20 transition-[background-color,box-shadow] duration-500",
        scrolled
          ? "bg-white shadow-lg shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-(--container-max) items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/logo-safiq.png"
            alt="Safiq Tour"
            width={34}
            height={40}
            priority
            className={cn(
              "h-10 w-auto transition-all duration-300",
              scrolled ? "brightness-100" : "brightness-0 invert"
            )}
          />
          <span
            className={cn(
              "font-heading text-xl font-semibold tracking-tight transition-colors duration-300",
              scrolled ? "text-[#0F3D75]" : "text-white"
            )}
          >
            Safiq Tour
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                pathname === item.href
                  ? scrolled
                    ? "bg-[#C79A3B]/10 text-[#C79A3B]"
                    : "bg-white/10 text-white"
                  : scrolled
                    ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/packages"
            className={cn(
              "ml-3 inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 hover:shadow-lg",
              scrolled
                ? "bg-[#C79A3B] text-white hover:bg-[#B8892E] hover:shadow-[#C79A3B]/30"
                : "bg-[#C79A3B] text-white hover:bg-[#B8892E] hover:shadow-[#C79A3B]/30"
            )}
          >
            Daftar Umroh
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg md:hidden",
            scrolled ? "text-gray-600" : "text-white"
          )}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-white md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-[#C79A3B]/10 text-[#C79A3B]"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/packages"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#C79A3B] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#B8892E]"
              >
                Daftar Umroh
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
