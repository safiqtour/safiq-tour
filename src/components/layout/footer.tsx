import { FooterCTA } from "./FooterCTA"
import { FooterLinks } from "./FooterLinks"
import { FooterPartners } from "./FooterPartners"
import { FooterBottom } from "./FooterBottom"

function Footer() {
  return (
    <footer className="bg-[#07162F]">
      <FooterCTA />
      <div className="mx-auto max-w-(--container-max) px-4 sm:px-6 lg:px-8">
        <div className="py-14">
          <FooterLinks />
        </div>
        <FooterPartners />
        <FooterBottom />
      </div>
    </footer>
  )
}

export { Footer }
