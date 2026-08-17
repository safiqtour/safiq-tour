import { Navbar } from "@/components/home/Navbar"
import { Footer } from "@/components/layout/footer"

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </>
  )
}

export default PublicLayout
