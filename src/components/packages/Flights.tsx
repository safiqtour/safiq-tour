"use client"

import { motion } from "framer-motion"
import { Plane, Clock } from "lucide-react"
import Image from "next/image"
import type { PublicFlightLeg, PublicFlightSegment } from "@/modules/public/packages"

type FlightsProps = {
  legs: PublicFlightLeg[]
}

/** Same fallback logo used by the public content builder / legacy Airlines section. */
const FALLBACK_LOGO = "/images/Saudi-Airlines.png"

/** Airline logo box (shared by the direct-leg header and per-hop headers). */
function AirlineLogoBox({ name, logo }: { name: string | null; logo: string | null }) {
  return (
    <div className="relative flex h-12 w-24 shrink-0 items-center justify-center rounded-xl border border-[#0B2D5C]/10 bg-white p-2">
      <Image
        src={logo || FALLBACK_LOGO}
        alt={name ? `Logo ${name}` : "Logo maskapai"}
        width={88}
        height={36}
        className="h-auto w-auto object-contain"
      />
    </div>
  )
}

/** Approximate timezone labels for common Umrah-route airports (display-only). */
const TZ_BY_IATA: Record<string, string> = {
  CGK: "WIB", // Indonesia barat (UTC+7)
  JED: "AST", MED: "AST", RUH: "AST", DMM: "AST", TIF: "AST", ELQ: "AST", // Saudi (UTC+3)
  DOH: "AST", KWI: "AST", BAH: "AST", AMM: "AST", // Timur Tengah (UTC+3)
  DXB: "GST", AUH: "GST", SHJ: "GST", MCT: "GST", // Teluk (UTC+4)
  IST: "TRT", SAW: "TRT", // Türkiye
  KUL: "MYT", SIN: "SGT", BKK: "ICT", CAI: "EEST",
}

/** Timezone label for an IATA code; "" when unknown (the label is then hidden). */
function tzLabel(iata: string): string {
  return TZ_BY_IATA[iata.trim().toUpperCase()] ?? ""
}

/** One side (departure/arrival) of the ticket route: city, IATA, time + timezone, date. */
function RoutePoint({
  city,
  airport,
  dateLabel,
  timeLabel,
}: {
  city: string
  airport: string
  dateLabel?: string | null
  timeLabel?: string | null
}) {
  const tz = tzLabel(airport)
  return (
    <div className="min-w-0 flex-1">
      <p
        className="font-playfair text-sm font-bold text-[#0B2D5C] sm:text-base"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {city || "—"}{" "}
        <span className="text-xs font-semibold text-[#D4AF37] sm:text-sm">({airport || "—"})</span>
      </p>
      {timeLabel && (
        <p className="mt-1.5 text-base font-bold text-[#0B2D5C]">
          {timeLabel}
          {tz && <span className="ml-1 text-[10px] font-bold tracking-wide text-[#D4AF37]">{tz}</span>}
        </p>
      )}
      {dateLabel && <p className="mt-0.5 text-[11px] text-[#0B2D5C]/50">{dateLabel}</p>}
    </div>
  )
}

/** Airline-ticket route: City (IATA) ─── ✈ ─── City (IATA), with time + timezone + date per side. */
function RouteBox({
  departureCity,
  departureAirport,
  arrivalCity,
  arrivalAirport,
  departureDateLabel,
  departureTimeLabel,
  arrivalDateLabel,
  arrivalTimeLabel,
}: {
  departureCity: string
  departureAirport: string
  arrivalCity: string
  arrivalAirport: string
  departureDateLabel?: string | null
  departureTimeLabel?: string | null
  arrivalDateLabel?: string | null
  arrivalTimeLabel?: string | null
}) {
  return (
    <div className="mt-4 rounded-xl border border-[#0B2D5C]/5 bg-[#F8FAFC] px-4 py-5">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-center">
        <RoutePoint
          city={departureCity}
          airport={departureAirport}
          dateLabel={departureDateLabel}
          timeLabel={departureTimeLabel}
        />
        <div className="flex min-w-10 flex-1 basis-full items-center gap-2 text-[#D4AF37] sm:basis-auto sm:min-w-24">
          <span className="h-px flex-1 bg-[#D4AF37]/40" />
          <Plane className="size-4 shrink-0 rotate-45" />
          <span className="h-px flex-1 bg-[#D4AF37]/40" />
        </div>
        <RoutePoint
          city={arrivalCity}
          airport={arrivalAirport}
          dateLabel={arrivalDateLabel}
          timeLabel={arrivalTimeLabel}
        />
      </div>
    </div>
  )
}

/** Gold separator shown between two hops of a transit leg. */
function TransitSeparator({ segment }: { segment: PublicFlightSegment }) {
  const place = [segment.arrivalCity, segment.arrivalAirport ? `(${segment.arrivalAirport})` : ""]
    .filter(Boolean)
    .join(" ")
  return (
    <div className="my-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-dashed border-[#D4AF37]/40 bg-[#D4AF37]/5 px-4 py-3">
      <Clock className="size-4 text-[#D4AF37]" />
      <span className="text-xs font-semibold tracking-wide text-[#8a6d1f] uppercase">
        Transit{place ? ` ${place}` : ""}
      </span>
      {segment.transitDurationToNext && (
        <span className="text-sm font-semibold text-[#0B2D5C]">
          Durasi Transit: {segment.transitDurationToNext}
        </span>
      )}
    </div>
  )
}

/** Card header: leg label as heading + Direct / Transit Nx type badge. */
function LegHeader({ leg }: { leg: PublicFlightLeg }) {
  const transitCount = leg.segments.length - 1
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <h3 className="font-heading text-base font-bold text-[#0B2D5C] md:text-lg">
        {leg.label}
      </h3>
      {transitCount > 0 ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase">
          <span className="size-1.5 rounded-full bg-amber-500" />
          Transit {transitCount}x
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Direct
        </span>
      )}
    </div>
  )
}

/** Compact "Airline • Flight Number" info line for a leg or hop. */
function CompactFlightInfo({ airlineName, flightNumber }: { airlineName: string | null; flightNumber: string }) {
  return (
    <p className="text-sm font-semibold text-[#0B2D5C]">
      {airlineName ?? "Maskapai Mitra"}
      {flightNumber && (
        <span className="font-bold tracking-wider text-[#D4AF37]">
          {" "}• {flightNumber}
        </span>
      )}
    </p>
  )
}

/** Direct flight — single-segment ticket layout. */
function DirectLegBody({ leg }: { leg: PublicFlightLeg }) {
  return (
    <>
      {/* Heading (leg label + type badge), airline logo on the right */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <LegHeader leg={leg} />
        <AirlineLogoBox name={leg.airlineName} logo={leg.airlineLogo} />
      </div>

      {/* Compact airline • flight number info */}
      <CompactFlightInfo airlineName={leg.airlineName} flightNumber={leg.flightNumber} />
      <RouteBox
        departureCity={leg.departureCity}
        departureAirport={leg.departureAirport}
        arrivalCity={leg.arrivalCity}
        arrivalAirport={leg.arrivalAirport}
        departureDateLabel={leg.departureDateLabel}
        departureTimeLabel={leg.departureTimeLabel}
        arrivalDateLabel={leg.arrivalDateLabel}
        arrivalTimeLabel={leg.arrivalTimeLabel}
      />
    </>
  )
}

/** Transit leg — every hop in segmentOrder, with a transit separator between hops. */
function TransitLegBody({ leg }: { leg: PublicFlightLeg }) {
  return (
    <>
      <div className="mb-5">
        <LegHeader leg={leg} />
      </div>
      {leg.segments.map((seg, i) => (
        <div key={seg.id}>
          {i > 0 && <TransitSeparator segment={leg.segments[i - 1]} />}
          <div className="flex items-center justify-between gap-4">
            <CompactFlightInfo airlineName={seg.airlineName} flightNumber={seg.flightNumber} />
            <AirlineLogoBox name={seg.airlineName} logo={seg.airlineLogo} />
          </div>
          <RouteBox
            departureCity={seg.departureCity}
            departureAirport={seg.departureAirport}
            arrivalCity={seg.arrivalCity}
            arrivalAirport={seg.arrivalAirport}
            departureDateLabel={seg.departureDateLabel}
            departureTimeLabel={seg.departureTimeLabel}
            arrivalDateLabel={seg.arrivalDateLabel}
            arrivalTimeLabel={seg.arrivalTimeLabel}
          />
        </div>
      ))}
    </>
  )
}

/**
 * "Penerbangan" — flight itinerary legs of a package (keberangkatan, transit,
 * side trips, kepulangan). Renders nothing when the package has no flight rows;
 * the page falls back to the legacy Airlines section in that case.
 */
export function Flights({ legs }: FlightsProps) {
  if (legs.length === 0) return null

  return (
    <section className="overflow-hidden bg-[#0B2D5C] py-16 md:py-20">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
            <Plane className="size-3.5" /> Penerbangan
          </span>
          <h2
            className="mt-4 font-playfair text-3xl font-bold leading-tight text-white md:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Detail Perjalanan Udara
          </h2>
          <p className="mt-3 text-center text-base text-white/60 md:text-lg">
            Rute penerbangan lengkap dari keberangkatan hingga kepulangan — jadwal, maskapai, dan transit dalam satu tampilan
          </p>
        </motion.div>

        {/* Vertical journey timeline: one full-width card per leg, numbered rail on the left */}
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-6 md:gap-8">
            {legs.map((leg, i) => (
              <div key={leg.id} className="flex gap-4 md:gap-5">
                <div className="flex flex-col items-center pt-1">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-bold text-[#0B2D5C] ring-4 ring-[#D4AF37]/15">
                    {i + 1}
                  </span>
                  {i < legs.length - 1 && (
                    <span className="mt-2 w-px flex-1 bg-gradient-to-b from-[#D4AF37]/50 to-white/10" />
                  )}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                  className="group min-w-0 flex-1 rounded-2xl bg-white p-6 shadow-lg shadow-black/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4AF37]/10"
                >
                  {/* Multi-hop legs render every segment; direct/single-segment legs keep the original layout. */}
                  {leg.segments.length > 1 ? (
                    <TransitLegBody leg={leg} />
                  ) : (
                    <DirectLegBody leg={leg} />
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
