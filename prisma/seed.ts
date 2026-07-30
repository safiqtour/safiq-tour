import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

const ROLE_PERMISSIONS_MAP: Record<string, { resource: string; action: string }[]> = {
  "super-admin": [
    { resource: "user", action: "all" },
    { resource: "role", action: "all" },
    { resource: "permission", action: "all" },
    { resource: "master", action: "all" },
    { resource: "master.country", action: "all" },
    { resource: "master.region", action: "all" },
    { resource: "master.city", action: "all" },
    { resource: "master.destination", action: "all" },
    { resource: "master.package-category", action: "all" },
    { resource: "master.package-type", action: "all" },
    { resource: "master.tag", action: "all" },
    { resource: "master.business-setting", action: "all" },
    { resource: "package", action: "all" },
    { resource: "booking", action: "all" },
    { resource: "pilgrim", action: "all" },
    { resource: "payment", action: "all" },
    { resource: "invoice", action: "all" },
    { resource: "document", action: "all" },
    { resource: "cms", action: "all" },
    { resource: "media", action: "all" },
    { resource: "marketing", action: "all" },
    { resource: "lead", action: "all" },
    { resource: "dashboard", action: "all" },
    { resource: "setting", action: "all" },
    { resource: "activity_log", action: "all" },
    { resource: "notification", action: "all" },
    { resource: "workflow", action: "all" },
  ],
  admin: [
    { resource: "user", action: "read" },
    { resource: "role", action: "read" },
    { resource: "master", action: "create" },
    { resource: "master", action: "read" },
    { resource: "master", action: "update" },
    { resource: "master", action: "delete" },
    { resource: "master.country", action: "all" },
    { resource: "master.region", action: "all" },
    { resource: "master.city", action: "all" },
    { resource: "master.destination", action: "all" },
    { resource: "master.facility", action: "all" },
    { resource: "master.visa", action: "all" },
    { resource: "master.currency", action: "all" },
    { resource: "master.promotion", action: "all" },
    { resource: "master.package-category", action: "all" },
    { resource: "master.package-type", action: "all" },
    { resource: "master.tag", action: "all" },
    { resource: "master.business-setting", action: "all" },
    { resource: "package", action: "create" },
    { resource: "package", action: "read" },
    { resource: "package", action: "update" },
    { resource: "package", action: "delete" },
    { resource: "booking", action: "create" },
    { resource: "booking", action: "read" },
    { resource: "booking", action: "update" },
    { resource: "pilgrim", action: "create" },
    { resource: "pilgrim", action: "read" },
    { resource: "pilgrim", action: "update" },
    { resource: "payment", action: "read" },
    { resource: "invoice", action: "read" },
    { resource: "document", action: "create" },
    { resource: "document", action: "read" },
    { resource: "document", action: "update" },
    { resource: "cms", action: "create" },
    { resource: "cms", action: "read" },
    { resource: "cms", action: "update" },
    { resource: "cms", action: "delete" },
    { resource: "media", action: "create" },
    { resource: "media", action: "read" },
    { resource: "media", action: "update" },
    { resource: "media", action: "delete" },
    { resource: "marketing", action: "create" },
    { resource: "marketing", action: "read" },
    { resource: "marketing", action: "update" },
    { resource: "lead", action: "create" },
    { resource: "lead", action: "read" },
    { resource: "lead", action: "update" },
    { resource: "dashboard", action: "read" },
    { resource: "activity_log", action: "read" },
    { resource: "notification", action: "read" },
  ],
  finance: [
    { resource: "payment", action: "read" },
    { resource: "payment", action: "create" },
    { resource: "payment", action: "update" },
    { resource: "invoice", action: "read" },
    { resource: "invoice", action: "create" },
    { resource: "invoice", action: "update" },
    { resource: "booking", action: "read" },
    { resource: "pilgrim", action: "read" },
    { resource: "dashboard", action: "read" },
    { resource: "notification", action: "read" },
  ],
  marketing: [
    { resource: "cms", action: "create" },
    { resource: "cms", action: "read" },
    { resource: "cms", action: "update" },
    { resource: "cms", action: "delete" },
    { resource: "media", action: "create" },
    { resource: "media", action: "read" },
    { resource: "media", action: "update" },
    { resource: "media", action: "delete" },
    { resource: "marketing", action: "create" },
    { resource: "marketing", action: "read" },
    { resource: "marketing", action: "update" },
    { resource: "marketing", action: "delete" },
    { resource: "dashboard", action: "read" },
    { resource: "notification", action: "read" },
  ],
  cs: [
    { resource: "booking", action: "create" },
    { resource: "booking", action: "read" },
    { resource: "booking", action: "update" },
    { resource: "pilgrim", action: "create" },
    { resource: "pilgrim", action: "read" },
    { resource: "pilgrim", action: "update" },
    { resource: "document", action: "create" },
    { resource: "document", action: "read" },
    { resource: "document", action: "update" },
    { resource: "lead", action: "create" },
    { resource: "lead", action: "read" },
    { resource: "lead", action: "update" },
    { resource: "payment", action: "read" },
    { resource: "package", action: "read" },
    { resource: "dashboard", action: "read" },
    { resource: "notification", action: "read" },
  ],
  muthowif: [
    { resource: "pilgrim", action: "read" },
    { resource: "booking", action: "read" },
    { resource: "package", action: "read" },
    { resource: "dashboard", action: "read" },
  ],
  owner: [
    { resource: "dashboard", action: "read" },
    { resource: "payment", action: "read" },
    { resource: "invoice", action: "read" },
    { resource: "booking", action: "read" },
    { resource: "activity_log", action: "read" },
    { resource: "setting", action: "read" },
  ],
}

async function main() {
  const password = await bcrypt.hash("admin123", 12)

  const rolesData = [
    { name: "Super Admin", slug: "super-admin", level: 100 },
    { name: "Admin", slug: "admin", level: 80 },
    { name: "Finance", slug: "finance", level: 60 },
    { name: "Marketing", slug: "marketing", level: 50 },
    { name: "Customer Service", slug: "cs", level: 40 },
    { name: "Muthowif", slug: "muthowif", level: 30 },
    { name: "Owner", slug: "owner", level: 99 },
  ]

  const seenPermissions = new Set<string>()
  const allPermissions: { resource: string; action: string; name: string }[] = []

  for (const [, perms] of Object.entries(ROLE_PERMISSIONS_MAP)) {
    for (const p of perms) {
      const key = `${p.resource}:${p.action}`
      if (!seenPermissions.has(key)) {
        seenPermissions.add(key)
        allPermissions.push({
          ...p,
          name: `${p.resource} ${p.action}`,
        })
      }
    }
  }

  const createdRoles: Record<string, string> = {}

  for (const roleData of rolesData) {
    const role = await db.role.upsert({
      where: { slug: roleData.slug },
      update: { name: roleData.name, level: roleData.level },
      create: roleData,
    })
    createdRoles[roleData.slug] = role.id
  }

  const createdPermissions: Record<string, string> = {}

  for (const perm of allPermissions) {
    const p = await db.permission.upsert({
      where: { resource_action: { resource: perm.resource, action: perm.action } },
      update: { name: perm.name },
      create: perm,
    })
    createdPermissions[`${perm.resource}:${perm.action}`] = p.id
  }

  for (const [roleSlug, perms] of Object.entries(ROLE_PERMISSIONS_MAP)) {
    const roleId = createdRoles[roleSlug]
    if (!roleId) continue

    for (const perm of perms) {
      const permKey = `${perm.resource}:${perm.action}`
      const permId = createdPermissions[permKey]
      if (!permId) continue

      await db.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId: permId } },
        update: { isAllowed: true },
        create: { roleId, permissionId: permId, isAllowed: true },
      })
    }
  }

  const usersData = [
    { name: "Super Admin", email: "superadmin@safiq.com", roleSlug: "super-admin" },
    { name: "Admin Safiq", email: "admin@safiq.com", roleSlug: "admin" },
    { name: "Finance Team", email: "finance@safiq.com", roleSlug: "finance" },
    { name: "Marketing Team", email: "marketing@safiq.com", roleSlug: "marketing" },
    { name: "CS Team", email: "cs@safiq.com", roleSlug: "cs" },
  ]

  for (const u of usersData) {
    await db.user.upsert({
      where: { email: u.email },
      update: { roleId: createdRoles[u.roleSlug] },
      create: {
        name: u.name,
        email: u.email,
        password,
        roleId: createdRoles[u.roleSlug],
      },
    })
  }

  const settingsData = [
    { key: "app_name", value: "STMS - Safiq Tour Management System", type: "STRING" },
    { key: "app_version", value: "1.0.0", type: "STRING" },
    { key: "items_per_page", value: "10", type: "NUMBER" },
    { key: "maintenance_mode", value: "false", type: "BOOLEAN" },
  ]

  for (const s of settingsData) {
    await db.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }

  const destinationTypes = [
    { name: "Default", slug: "default", sortOrder: 0 },
    { name: "City", slug: "city", sortOrder: 1 },
    { name: "Mosque", slug: "mosque", sortOrder: 2 },
    { name: "Historical", slug: "historical", sortOrder: 3 },
    { name: "Museum", slug: "museum", sortOrder: 4 },
    { name: "Shopping", slug: "shopping", sortOrder: 5 },
    { name: "Airport", slug: "airport", sortOrder: 6 },
    { name: "Hotel Area", slug: "hotel-area", sortOrder: 7 },
    { name: "Restaurant", slug: "restaurant", sortOrder: 8 },
    { name: "Mountain", slug: "mountain", sortOrder: 9 },
    { name: "Landmark", slug: "landmark", sortOrder: 10 },
  ]

  const createdTypes: Record<string, string> = {}
  for (const dt of destinationTypes) {
    const type = await db.destinationType.upsert({
      where: { slug: dt.slug },
      update: { name: dt.name, sortOrder: dt.sortOrder },
      create: dt,
    })
    createdTypes[dt.slug] = type.id
  }

  const countries = [
    { name: "Saudi Arabia", slug: "saudi-arabia", code: "SA", phoneCode: "+966", flag: "🇸🇦", sortOrder: 1 },
    { name: "Turkey", slug: "turkey", code: "TR", phoneCode: "+90", flag: "🇹🇷", sortOrder: 2 },
    { name: "Egypt", slug: "egypt", code: "EG", phoneCode: "+20", flag: "🇪🇬", sortOrder: 3 },
    { name: "United Arab Emirates", slug: "united-arab-emirates", code: "AE", phoneCode: "+971", flag: "🇦🇪", sortOrder: 4 },
    { name: "Uzbekistan", slug: "uzbekistan", code: "UZ", phoneCode: "+998", flag: "🇺🇿", sortOrder: 5 },
    { name: "Jordan", slug: "jordan", code: "JO", phoneCode: "+962", flag: "🇯🇴", sortOrder: 6 },
    { name: "Qatar", slug: "qatar", code: "QA", phoneCode: "+974", flag: "🇶🇦", sortOrder: 7 },
    { name: "Malaysia", slug: "malaysia", code: "MY", phoneCode: "+60", flag: "🇲🇾", sortOrder: 8 },
    { name: "Singapore", slug: "singapore", code: "SG", phoneCode: "+65", flag: "🇸🇬", sortOrder: 9 },
    { name: "Thailand", slug: "thailand", code: "TH", phoneCode: "+66", flag: "🇹🇭", sortOrder: 10 },
    { name: "Japan", slug: "japan", code: "JP", phoneCode: "+81", flag: "🇯🇵", sortOrder: 11 },
    { name: "South Korea", slug: "south-korea", code: "KR", phoneCode: "+82", flag: "🇰🇷", sortOrder: 12 },
    { name: "China", slug: "china", code: "CN", phoneCode: "+86", flag: "🇨🇳", sortOrder: 13 },
    { name: "United Kingdom", slug: "united-kingdom", code: "GB", phoneCode: "+44", flag: "🇬🇧", sortOrder: 14 },
    { name: "United States", slug: "united-states", code: "US", phoneCode: "+1", flag: "🇺🇸", sortOrder: 15 },
    { name: "Australia", slug: "australia", code: "AU", phoneCode: "+61", flag: "🇦🇺", sortOrder: 16 },
    { name: "Morocco", slug: "morocco", code: "MA", phoneCode: "+212", flag: "🇲🇦", sortOrder: 17 },
    { name: "Schengen Area", slug: "schengen-area", code: "EU", phoneCode: "", flag: "🇪🇺", sortOrder: 18 },
  ]

  const createdCountries: Record<string, string> = {}
  for (const c of countries) {
    const country = await db.country.upsert({
      where: { slug: c.slug },
      update: { name: c.name, code: c.code, phoneCode: c.phoneCode, flag: c.flag, sortOrder: c.sortOrder },
      create: c,
    })
    createdCountries[c.slug] = country.id
  }

  const regions = [
    { name: "Makkah Province", slug: "makkah-province", countrySlug: "saudi-arabia", sortOrder: 1 },
    { name: "Madinah Province", slug: "madinah-province", countrySlug: "saudi-arabia", sortOrder: 2 },
  ]

  const createdRegions: Record<string, string> = {}
  for (const r of regions) {
    const region = await db.region.upsert({
      where: { slug_countryId: { slug: r.slug, countryId: createdCountries[r.countrySlug] } },
      update: { name: r.name, sortOrder: r.sortOrder },
      create: { name: r.name, slug: r.slug, countryId: createdCountries[r.countrySlug], sortOrder: r.sortOrder },
    })
    createdRegions[r.slug] = region.id
  }

  const cities = [
    { name: "Makkah", slug: "makkah", countrySlug: "saudi-arabia", regionSlug: "makkah-province", sortOrder: 1 },
    { name: "Madinah", slug: "madinah", countrySlug: "saudi-arabia", regionSlug: "madinah-province", sortOrder: 2 },
    { name: "Jeddah", slug: "jeddah", countrySlug: "saudi-arabia", regionSlug: "makkah-province", sortOrder: 3 },
    { name: "Taif", slug: "taif", countrySlug: "saudi-arabia", regionSlug: "makkah-province", sortOrder: 4 },
  ]

  const createdCities: Record<string, string> = {}
  for (const ct of cities) {
    const city = await db.city.upsert({
      where: { slug_countryId: { slug: ct.slug, countryId: createdCountries[ct.countrySlug] } },
      update: { name: ct.name, regionId: createdRegions[ct.regionSlug], sortOrder: ct.sortOrder },
      create: {
        name: ct.name, slug: ct.slug,
        countryId: createdCountries[ct.countrySlug],
        regionId: createdRegions[ct.regionSlug],
        sortOrder: ct.sortOrder,
      },
    })
    createdCities[ct.slug] = city.id
  }

  const destinations = [
    { name: "Masjidil Haram", slug: "masjidil-haram", typeSlug: "mosque", countrySlug: "saudi-arabia", regionSlug: "makkah-province", citySlug: "makkah", sortOrder: 1 },
    { name: "Masjid Nabawi", slug: "masjid-nabawi", typeSlug: "mosque", countrySlug: "saudi-arabia", regionSlug: "madinah-province", citySlug: "madinah", sortOrder: 2 },
    { name: "Jabal Uhud", slug: "jabal-uhud", typeSlug: "landmark", countrySlug: "saudi-arabia", regionSlug: "madinah-province", citySlug: "madinah", sortOrder: 3 },
    { name: "Jabal Rahmah", slug: "jabal-rahmah", typeSlug: "landmark", countrySlug: "saudi-arabia", regionSlug: "makkah-province", citySlug: "makkah", sortOrder: 4 },
    { name: "Masjid Quba", slug: "masjid-quba", typeSlug: "mosque", countrySlug: "saudi-arabia", regionSlug: "madinah-province", citySlug: "madinah", sortOrder: 5 },
    { name: "Masjid Qiblatain", slug: "masjid-qiblatain", typeSlug: "mosque", countrySlug: "saudi-arabia", regionSlug: "madinah-province", citySlug: "madinah", sortOrder: 6 },
    { name: "Jabal Nur", slug: "jabal-nur", typeSlug: "mountain", countrySlug: "saudi-arabia", regionSlug: "makkah-province", citySlug: "makkah", sortOrder: 7 },
    { name: "Jabal Tsur", slug: "jabal-tsur", typeSlug: "mountain", countrySlug: "saudi-arabia", regionSlug: "makkah-province", citySlug: "makkah", sortOrder: 8 },
  ]

  for (const d of destinations) {
    await db.destination.upsert({
      where: { slug_countryId: { slug: d.slug, countryId: createdCountries[d.countrySlug] } },
      update: { name: d.name, destinationTypeId: createdTypes[d.typeSlug], regionId: createdRegions[d.regionSlug], cityId: createdCities[d.citySlug], sortOrder: d.sortOrder },
      create: {
        name: d.name, slug: d.slug, description: "",
        destinationTypeId: createdTypes[d.typeSlug],
        countryId: createdCountries[d.countrySlug],
        regionId: createdRegions[d.regionSlug],
        cityId: createdCities[d.citySlug],
        sortOrder: d.sortOrder,
      },
    })
  }

  const amenityNames = ["WiFi", "Restaurant", "Breakfast", "Laundry", "Gym", "Coffee Shop", "Meeting Room", "Shuttle", "Wheelchair", "Family Room", "Prayer Room"]

  const createdAmenities: Record<string, string> = {}
  for (const name of amenityNames) {
    const existing = await db.hotelAmenity.findFirst({ where: { name } })
    if (!existing) {
      const a = await db.hotelAmenity.create({ data: { name, sortOrder: amenityNames.indexOf(name) } })
      createdAmenities[name] = a.id
    } else {
      createdAmenities[name] = existing.id
    }
  }

  const hotelData = [
    { name: "Pullman Zamzam", slug: "pullman-zamzam", countrySlug: "saudi-arabia", citySlug: "makkah", stars: 5, distanceHaram: "50m", distanceNabawi: "", status: "ACTIVE", sortOrder: 1 },
    { name: "Swissotel Makkah", slug: "swissotel-makkah", countrySlug: "saudi-arabia", citySlug: "makkah", stars: 5, distanceHaram: "100m", distanceNabawi: "", status: "ACTIVE", sortOrder: 2 },
    { name: "Hilton Convention Makkah", slug: "hilton-convention-makkah", countrySlug: "saudi-arabia", citySlug: "makkah", stars: 5, distanceHaram: "200m", distanceNabawi: "", status: "ACTIVE", sortOrder: 3 },
    { name: "Anjum Hotel Makkah", slug: "anjum-hotel-makkah", countrySlug: "saudi-arabia", citySlug: "makkah", stars: 5, distanceHaram: "300m", distanceNabawi: "", status: "ACTIVE", sortOrder: 4 },
    { name: "Elaf Kinda", slug: "elaf-kinda", countrySlug: "saudi-arabia", citySlug: "makkah", stars: 4, distanceHaram: "500m", distanceNabawi: "", status: "ACTIVE", sortOrder: 5 },
    { name: "Pullman Zamzam Madinah", slug: "pullman-zamzam-madinah", countrySlug: "saudi-arabia", citySlug: "madinah", stars: 5, distanceHaram: "", distanceNabawi: "50m", status: "ACTIVE", sortOrder: 6 },
    { name: "Saja Al Madinah", slug: "saja-al-madinah", countrySlug: "saudi-arabia", citySlug: "madinah", stars: 4, distanceHaram: "", distanceNabawi: "200m", status: "ACTIVE", sortOrder: 7 },
    { name: "Frontel Al Harithia", slug: "frontel-al-harithia", countrySlug: "saudi-arabia", citySlug: "madinah", stars: 3, distanceHaram: "", distanceNabawi: "1km", status: "ACTIVE", sortOrder: 8 },
    { name: "Ramada Istanbul", slug: "ramada-istanbul", countrySlug: "turkey", stars: 4, distanceHaram: "", distanceNabawi: "", status: "ACTIVE", sortOrder: 9 },
    { name: "Hilton Bursa", slug: "hilton-bursa", countrySlug: "turkey", stars: 5, distanceHaram: "", distanceNabawi: "", status: "ACTIVE", sortOrder: 10 },
    { name: "Cappadocia Cave Suites", slug: "cappadocia-cave-suites", countrySlug: "turkey", stars: 4, distanceHaram: "", distanceNabawi: "", status: "ACTIVE", sortOrder: 11 },
    { name: "Hilton Cairo", slug: "hilton-cairo", countrySlug: "egypt", stars: 5, distanceHaram: "", distanceNabawi: "", status: "ACTIVE", sortOrder: 12 },
    { name: "Steigenberger Cairo", slug: "steigenberger-cairo", countrySlug: "egypt", stars: 5, distanceHaram: "", distanceNabawi: "", status: "ACTIVE", sortOrder: 13 },
    { name: "Le Méridien Cairo", slug: "le-meridien-cairo", countrySlug: "egypt", stars: 4, distanceHaram: "", distanceNabawi: "", status: "ACTIVE", sortOrder: 14 },
    { name: "Millennium Plaza Dubai", slug: "millennium-plaza-dubai", countrySlug: "united-arab-emirates", stars: 5, distanceHaram: "", distanceNabawi: "", status: "ACTIVE", sortOrder: 15 },
    { name: "Crowne Plaza Dubai", slug: "crowne-plaza-dubai", countrySlug: "united-arab-emirates", stars: 4, distanceHaram: "", distanceNabawi: "", status: "ACTIVE", sortOrder: 16 },
    { name: "JW Marriott Marquis Dubai", slug: "jw-marriott-marquis-dubai", countrySlug: "united-arab-emirates", stars: 5, distanceHaram: "", distanceNabawi: "", status: "ACTIVE", sortOrder: 17 },
  ]

  for (const h of hotelData) {
    const existing = await db.hotel.findUnique({ where: { slug: h.slug } })
    if (!existing) {
      const cityId = h.citySlug ? createdCities[h.citySlug] : undefined
      await db.hotel.create({
        data: {
          name: h.name, slug: h.slug, starRating: h.stars,
          countryId: createdCountries[h.countrySlug],
          cityId: cityId ?? null,
          distanceToHaram: h.distanceHaram, distanceToNabawi: h.distanceNabawi,
          status: h.status, sortOrder: h.sortOrder,
        },
      })
    }
  }

  const airlineData = [
    { name: "Garuda Indonesia", slug: "garuda-indonesia", iata: "GA", icao: "GIA", countrySlug: "" },
    { name: "Saudia", slug: "saudia", iata: "SV", icao: "SVA", countrySlug: "saudi-arabia" },
    { name: "Qatar Airways", slug: "qatar-airways", iata: "QR", icao: "QTR", countrySlug: "qatar" },
    { name: "Turkish Airlines", slug: "turkish-airlines", iata: "TK", icao: "THY", countrySlug: "turkey" },
    { name: "Emirates", slug: "emirates", iata: "EK", icao: "UAE", countrySlug: "united-arab-emirates" },
    { name: "Etihad", slug: "etihad", iata: "EY", icao: "ETD", countrySlug: "united-arab-emirates" },
    { name: "Lion Air", slug: "lion-air", iata: "JT", icao: "LNI", countrySlug: "" },
    { name: "Batik Air", slug: "batik-air", iata: "ID", icao: "BTK", countrySlug: "" },
  ]

  for (const a of airlineData) {
    const existing = await db.airline.findUnique({ where: { slug: a.slug } })
    if (!existing) {
      await db.airline.create({
        data: {
          name: a.name, slug: a.slug,
          iataCode: a.iata, icaoCode: a.icao,
          countryId: a.countrySlug ? createdCountries[a.countrySlug] : null,
          status: "ACTIVE",
        },
      })
    }
  }

  const transportationData = [
    { name: "Bus 50 Seat", slug: "bus-50-seat", type: "BUS", capacity: 50 },
    { name: "Bus 30 Seat", slug: "bus-30-seat", type: "BUS", capacity: 30 },
    { name: "Hiace", slug: "hiace", type: "HIACE", capacity: 12 },
    { name: "Coaster", slug: "coaster", type: "COASTER", capacity: 25 },
    { name: "Alphard", slug: "alphard", type: "SUV", capacity: 6 },
    { name: "SUV", slug: "suv", type: "SUV", capacity: 4 },
  ]

  for (const t of transportationData) {
    const existing = await db.transportation.findUnique({ where: { slug: t.slug } })
    if (!existing) {
      await db.transportation.create({
        data: { name: t.name, slug: t.slug, type: t.type, capacity: t.capacity, status: "ACTIVE" },
      })
    }
  }

  const facilityData = [
    { name: "Visa Umrah", icon: "FileCheck", category: "Administration", sortOrder: 1 },
    { name: "Hotel", icon: "Hotel", category: "Accommodation", sortOrder: 2 },
    { name: "Hotel Bintang 5", icon: "Hotel", category: "Accommodation", sortOrder: 3 },
    { name: "Hotel Bintang 4", icon: "Hotel", category: "Accommodation", sortOrder: 4 },
    { name: "Hotel Bintang 3", icon: "Hotel", category: "Accommodation", sortOrder: 5 },
    { name: "Hotel Dekat Haram", icon: "MapPin", category: "Accommodation", sortOrder: 6 },
    { name: "Hotel Dekat Nabawi", icon: "MapPin", category: "Accommodation", sortOrder: 7 },
    { name: "Hotel Luar Kota", icon: "Hotel", category: "Accommodation", sortOrder: 8 },
    { name: "Bus Executive", icon: "Bus", category: "Transportation", sortOrder: 10 },
    { name: "Bus Reguler", icon: "Bus", category: "Transportation", sortOrder: 11 },
    { name: "Hiace", icon: "Bus", category: "Transportation", sortOrder: 12 },
    { name: "Coaster", icon: "Bus", category: "Transportation", sortOrder: 13 },
    { name: "Alphard", icon: "Car", category: "Transportation", sortOrder: 14 },
    { name: "SUV", icon: "Car", category: "Transportation", sortOrder: 15 },
    { name: "Kereta Cepat", icon: "Train", category: "Transportation", sortOrder: 16 },
    { name: "Pesawat PP", icon: "Plane", category: "Transportation", sortOrder: 17 },
    { name: "Pesawat Ekonomi", icon: "Plane", category: "Transportation", sortOrder: 18 },
    { name: "Pesawat Bisnis", icon: "Plane", category: "Transportation", sortOrder: 19 },
    { name: "Bagasi 30kg", icon: "Luggage", category: "Transportation", sortOrder: 20 },
    { name: "Bagasi 40kg", icon: "Luggage", category: "Transportation", sortOrder: 21 },
    { name: "Air Zamzam", icon: "Droplets", category: "Worship", sortOrder: 22 },
    { name: "Air Zamzam 5 Liter", icon: "Droplets", category: "Worship", sortOrder: 23 },
    { name: "Air Zamzam 10 Liter", icon: "Droplets", category: "Worship", sortOrder: 24 },
    { name: "Makan 3x Sehari", icon: "UtensilsCrossed", category: "Meals", sortOrder: 25 },
    { name: "Makan 2x Sehari", icon: "UtensilsCrossed", category: "Meals", sortOrder: 26 },
    { name: "Makan Prasmanan", icon: "UtensilsCrossed", category: "Meals", sortOrder: 27 },
    { name: "Snack & Minuman", icon: "CupSoda", category: "Meals", sortOrder: 28 },
    { name: "Laundry", icon: "Shirt", category: "Administration", sortOrder: 29 },
    { name: "Handling Bandara", icon: "ConciergeBell", category: "Administration", sortOrder: 30 },
    { name: "Muthowif", icon: "UserCheck", category: "Guide", sortOrder: 31 },
    { name: "Tour Leader", icon: "UserCheck", category: "Guide", sortOrder: 32 },
    { name: "Pembimbing Ibadah", icon: "Heart", category: "Guide", sortOrder: 33 },
    { name: "Private Guide", icon: "UserCheck", category: "Guide", sortOrder: 34 },
    { name: "Manasik Umrah", icon: "BookOpen", category: "Worship", sortOrder: 35 },
    { name: "Perlengkapan Umrah", icon: "Package", category: "Equipment", sortOrder: 36 },
    { name: "Koper & Tas", icon: "Luggage", category: "Equipment", sortOrder: 37 },
    { name: "Mukena & Sarung", icon: "Shirt", category: "Equipment", sortOrder: 38 },
    { name: "Asuransi Perjalanan", icon: "ShieldCheck", category: "Insurance", sortOrder: 39 },
    { name: "Asuransi Kesehatan", icon: "ShieldCheck", category: "Insurance", sortOrder: 40 },
    { name: "SIM Card Lokal", icon: "Smartphone", category: "Communication", sortOrder: 41 },
    { name: "Free WiFi", icon: "Wifi", category: "Communication", sortOrder: 42 },
    { name: "Kursi Roda", icon: "Accessibility", category: "Health", sortOrder: 43 },
    { name: "Medical Assistance", icon: "Stethoscope", category: "Health", sortOrder: 44 },
    { name: "Dokter Pendamping", icon: "Stethoscope", category: "Health", sortOrder: 45 },
    { name: "City Tour", icon: "Map", category: "Other", sortOrder: 46 },
    { name: "Fast Track", icon: "Zap", category: "Administration", sortOrder: 47 },
    { name: "Airport Lounge", icon: "Sofa", category: "Administration", sortOrder: 48 },
    { name: "Private Bus", icon: "Bus", category: "Transportation", sortOrder: 49 },
    { name: "Visa Processing", icon: "FileCheck", category: "Documents", sortOrder: 50 },
    { name: "Passport Handling", icon: "FileCheck", category: "Documents", sortOrder: 51 },
    { name: "Dokumen Perjalanan", icon: "FileText", category: "Documents", sortOrder: 52 },
    { name: "Coffee Break", icon: "Coffee", category: "Meals", sortOrder: 53 },
    { name: "Breakfast", icon: "UtensilsCrossed", category: "Meals", sortOrder: 54 },
    { name: "Lunch", icon: "UtensilsCrossed", category: "Meals", sortOrder: 55 },
    { name: "Dinner", icon: "UtensilsCrossed", category: "Meals", sortOrder: 56 },
  ]

  const folderNames = [
    "Packages", "Hotels", "Destinations", "Articles", "Gallery",
    "Hero", "Logo", "Users", "Passport", "Visa", "Invoice",
    "Documents", "Marketing",
  ]

  for (const f of folderNames) {
    const slug = f.toLowerCase()
    const existing = await db.mediaFolder.findFirst({ where: { slug, parentId: null } })
    if (!existing) {
      await db.mediaFolder.create({ data: { name: f, slug, sortOrder: folderNames.indexOf(f) } })
    }
  }

  const createdFacilities: Record<string, string> = {}
  const codePrefixes: Record<string, number> = {}
  for (const f of facilityData) {
    const slug = f.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const existing = await db.facility.findUnique({ where: { slug } })
    if (!existing) {
      const cat = f.category.substring(0, 3).toUpperCase()
      const prefix = codePrefixes[cat] ?? 0
      codePrefixes[cat] = prefix + 1
      const code = `FAC-${cat}-${String(prefix + 1).padStart(3, "0")}`
      const fac = await db.facility.create({
        data: { name: f.name, slug, code, icon: f.icon, category: f.category, sortOrder: f.sortOrder, status: "ACTIVE" },
      })
      createdFacilities[f.name] = fac.id
    } else {
      createdFacilities[f.name] = existing.id
    }
  }

  const visaData = [
    { name: "Umrah Visa", slug: "umrah-visa", countrySlug: "saudi-arabia", type: "UMRAH", entry: "SINGLE", processing: 5, validity: 90, stay: 30, electronic: true, sortOrder: 1 },
    { name: "Hajj Visa", slug: "hajj-visa", countrySlug: "saudi-arabia", type: "HAJJ", entry: "SINGLE", processing: 7, validity: 60, stay: 45, electronic: false, sortOrder: 2 },
    { name: "Tourist Visa Saudi", slug: "tourist-visa-saudi", countrySlug: "saudi-arabia", type: "TOURIST", entry: "MULTIPLE", processing: 3, validity: 365, stay: 90, electronic: true, sortOrder: 3 },
    { name: "Tourist Visa Turkey", slug: "tourist-visa-turkey", countrySlug: "turkey", type: "TOURIST", entry: "SINGLE", processing: 2, validity: 180, stay: 30, electronic: true, sortOrder: 4 },
    { name: "Tourist Visa Egypt", slug: "tourist-visa-egypt", countrySlug: "egypt", type: "TOURIST", entry: "SINGLE", processing: 3, validity: 90, stay: 30, electronic: false, sortOrder: 5 },
    { name: "Tourist Visa UAE", slug: "tourist-visa-uae", countrySlug: "united-arab-emirates", type: "TOURIST", entry: "SINGLE", processing: 3, validity: 90, stay: 30, electronic: true, sortOrder: 6 },
    { name: "Tourist Visa Jordan", slug: "tourist-visa-jordan", countrySlug: "jordan", type: "TOURIST", entry: "SINGLE", processing: 5, validity: 90, stay: 30, electronic: false, sortOrder: 7 },
    { name: "Tourist Visa Qatar", slug: "tourist-visa-qatar", countrySlug: "qatar", type: "TOURIST", entry: "SINGLE", processing: 2, validity: 180, stay: 30, electronic: true, sortOrder: 8 },
    { name: "Tourist Visa Malaysia", slug: "tourist-visa-malaysia", countrySlug: "malaysia", type: "TOURIST", entry: "SINGLE", processing: 3, validity: 90, stay: 30, electronic: true, sortOrder: 9 },
    { name: "Tourist Visa Singapore", slug: "tourist-visa-singapore", countrySlug: "singapore", type: "TOURIST", entry: "SINGLE", processing: 3, validity: 90, stay: 30, electronic: true, sortOrder: 10 },
    { name: "Tourist Visa Thailand", slug: "tourist-visa-thailand", countrySlug: "thailand", type: "TOURIST", entry: "SINGLE", processing: 3, validity: 90, stay: 30, electronic: true, sortOrder: 11 },
    { name: "Tourist Visa Japan", slug: "tourist-visa-japan", countrySlug: "japan", type: "TOURIST", entry: "SINGLE", processing: 5, validity: 90, stay: 15, electronic: false, sortOrder: 12 },
    { name: "Tourist Visa South Korea", slug: "tourist-visa-south-korea", countrySlug: "south-korea", type: "TOURIST", entry: "SINGLE", processing: 5, validity: 90, stay: 30, electronic: false, sortOrder: 13 },
    { name: "Tourist Visa China", slug: "tourist-visa-china", countrySlug: "china", type: "TOURIST", entry: "SINGLE", processing: 7, validity: 90, stay: 30, electronic: false, sortOrder: 14 },
    { name: "Tourist Visa UK", slug: "tourist-visa-uk", countrySlug: "united-kingdom", type: "TOURIST", entry: "SINGLE", processing: 10, validity: 180, stay: 30, electronic: true, sortOrder: 15 },
    { name: "Schengen Tourist Visa", slug: "schengen-tourist-visa", countrySlug: "schengen-area", type: "TOURIST", entry: "SINGLE", processing: 10, validity: 90, stay: 30, electronic: false, sortOrder: 16 },
    { name: "Tourist Visa USA", slug: "tourist-visa-usa", countrySlug: "united-states", type: "TOURIST", entry: "SINGLE", processing: 14, validity: 365, stay: 30, electronic: true, sortOrder: 17 },
    { name: "Tourist Visa Australia", slug: "tourist-visa-australia", countrySlug: "australia", type: "TOURIST", entry: "SINGLE", processing: 10, validity: 365, stay: 90, electronic: true, sortOrder: 18 },
    { name: "Tourist Visa Uzbekistan", slug: "tourist-visa-uzbekistan", countrySlug: "uzbekistan", type: "TOURIST", entry: "SINGLE", processing: 3, validity: 90, stay: 30, electronic: true, sortOrder: 19 },
    { name: "Tourist Visa Morocco", slug: "tourist-visa-morocco", countrySlug: "morocco", type: "TOURIST", entry: "SINGLE", processing: 5, validity: 90, stay: 30, electronic: false, sortOrder: 20 },
    { name: "Business Visa Saudi", slug: "business-visa-saudi", countrySlug: "saudi-arabia", type: "BUSINESS", entry: "MULTIPLE", processing: 5, validity: 365, stay: 90, electronic: true, sortOrder: 21 },
    { name: "Transit Visa Saudi", slug: "transit-visa-saudi", countrySlug: "saudi-arabia", type: "TRANSIT", entry: "SINGLE", processing: 1, validity: 30, stay: 3, electronic: true, sortOrder: 22 },
  ]

  const currencyData = [
    { name: "Indonesian Rupiah", slug: "indonesian-rupiah", iso: "IDR", symbol: "Rp", position: "PREFIX", digits: 0, thousand: ".", decimal: ",", rate: 1.0, base: true, countrySlug: "" },
    { name: "Saudi Riyal", slug: "saudi-riyal", iso: "SAR", symbol: "﷼", position: "SUFFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.00024, base: false, countrySlug: "saudi-arabia" },
    { name: "US Dollar", slug: "us-dollar", iso: "USD", symbol: "$", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.000064, base: false, countrySlug: "united-states" },
    { name: "Euro", slug: "euro", iso: "EUR", symbol: "€", position: "PREFIX", digits: 2, thousand: ".", decimal: ",", rate: 0.000059, base: false, countrySlug: "" },
    { name: "British Pound", slug: "british-pound", iso: "GBP", symbol: "£", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.000050, base: false, countrySlug: "united-kingdom" },
    { name: "Japanese Yen", slug: "japanese-yen", iso: "JPY", symbol: "¥", position: "PREFIX", digits: 0, thousand: ",", decimal: ".", rate: 0.010, base: false, countrySlug: "japan" },
    { name: "Chinese Yuan", slug: "chinese-yuan", iso: "CNY", symbol: "¥", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.00046, base: false, countrySlug: "china" },
    { name: "Malaysian Ringgit", slug: "malaysian-ringgit", iso: "MYR", symbol: "RM", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.00030, base: false, countrySlug: "malaysia" },
    { name: "Singapore Dollar", slug: "singapore-dollar", iso: "SGD", symbol: "S$", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.000086, base: false, countrySlug: "singapore" },
    { name: "Thai Baht", slug: "thai-baht", iso: "THB", symbol: "฿", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.0023, base: false, countrySlug: "thailand" },
    { name: "UAE Dirham", slug: "uae-dirham", iso: "AED", symbol: "د.إ", position: "SUFFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.00024, base: false, countrySlug: "united-arab-emirates" },
    { name: "Qatari Riyal", slug: "qatari-riyal", iso: "QAR", symbol: "﷼", position: "SUFFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.00023, base: false, countrySlug: "qatar" },
    { name: "Turkish Lira", slug: "turkish-lira", iso: "TRY", symbol: "₺", position: "PREFIX", digits: 2, thousand: ".", decimal: ",", rate: 0.0021, base: false, countrySlug: "turkey" },
    { name: "Australian Dollar", slug: "australian-dollar", iso: "AUD", symbol: "A$", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.000097, base: false, countrySlug: "australia" },
    { name: "New Zealand Dollar", slug: "new-zealand-dollar", iso: "NZD", symbol: "NZ$", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.00010, base: false, countrySlug: "" },
    { name: "Swiss Franc", slug: "swiss-franc", iso: "CHF", symbol: "CHF", position: "PREFIX", digits: 2, thousand: "'", decimal: ".", rate: 0.000057, base: false, countrySlug: "" },
    { name: "Canadian Dollar", slug: "canadian-dollar", iso: "CAD", symbol: "C$", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.000088, base: false, countrySlug: "" },
    { name: "Hong Kong Dollar", slug: "hong-kong-dollar", iso: "HKD", symbol: "HK$", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.00050, base: false, countrySlug: "" },
    { name: "South Korean Won", slug: "south-korean-won", iso: "KRW", symbol: "₩", position: "PREFIX", digits: 0, thousand: ",", decimal: ".", rate: 0.088, base: false, countrySlug: "south-korea" },
    { name: "Indian Rupee", slug: "indian-rupee", iso: "INR", symbol: "₹", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.0054, base: false, countrySlug: "" },
    { name: "Egyptian Pound", slug: "egyptian-pound", iso: "EGP", symbol: "E£", position: "PREFIX", digits: 2, thousand: ",", decimal: ".", rate: 0.0020, base: false, countrySlug: "egypt" },
    { name: "Jordanian Dinar", slug: "jordanian-dinar", iso: "JOD", symbol: "د.ا", position: "SUFFIX", digits: 3, thousand: ",", decimal: ".", rate: 0.000046, base: false, countrySlug: "jordan" },
    { name: "Omani Rial", slug: "omani-rial", iso: "OMR", symbol: "﷼", position: "SUFFIX", digits: 3, thousand: ",", decimal: ".", rate: 0.000025, base: false, countrySlug: "" },
    { name: "Kuwaiti Dinar", slug: "kuwaiti-dinar", iso: "KWD", symbol: "د.ك", position: "SUFFIX", digits: 3, thousand: ",", decimal: ".", rate: 0.000020, base: false, countrySlug: "" },
    { name: "Bahraini Dinar", slug: "bahraini-dinar", iso: "BHD", symbol: "د.ب", position: "SUFFIX", digits: 3, thousand: ",", decimal: ".", rate: 0.000024, base: false, countrySlug: "" },
  ]

  let currencyCount = 0
  for (const c of currencyData) {
    const slug = c.slug
    const existing = await db.currency.findUnique({ where: { slug } })
    if (!existing) {
      const num = currencyData.indexOf(c) + 1
      await db.currency.create({
        data: {
          code: `CUR-${String(num).padStart(3, "0")}`,
          slug: c.slug,
          name: c.name,
          isoCode: c.iso,
          symbol: c.symbol,
          symbolPosition: c.position,
          decimalDigits: c.digits,
          thousandSeparator: c.thousand,
          decimalSeparator: c.decimal,
          exchangeRate: c.rate,
          isBaseCurrency: c.base,
          countryId: c.countrySlug ? createdCountries[c.countrySlug] : null,
          sortOrder: num,
          status: "ACTIVE",
        },
      })
      currencyCount++
    } else {
      currencyCount++
    }
  }

  const promotionData = [
    { name: "Early Bird 2026", type: "EARLY_BIRD", discount: "PERCENTAGE", value: 15, minPurchase: 0, maxDiscount: 3000000, startDate: "2026-01-01", endDate: "2026-03-31", limit: 100, public: true, autoApply: false, priority: 10 },
    { name: "Flash Sale Muharram", type: "FLASH_SALE", discount: "PERCENTAGE", value: 25, minPurchase: 0, maxDiscount: 5000000, startDate: "2026-07-01", endDate: "2026-07-15", limit: 50, public: true, autoApply: true, priority: 20 },
    { name: "Ramadhan Promo", type: "RAMADHAN", discount: "PERCENTAGE", value: 20, minPurchase: 0, maxDiscount: 4000000, startDate: "2026-02-01", endDate: "2026-03-31", limit: 200, public: true, autoApply: true, priority: 30 },
    { name: "Weekend Promo", type: "SEASONAL", discount: "PERCENTAGE", value: 10, minPurchase: 10000000, maxDiscount: 2000000, startDate: "2026-01-01", endDate: "2026-12-31", limit: 0, public: true, autoApply: false, priority: 5 },
    { name: "New Customer", type: "NEW_CUSTOMER", discount: "FIXED_AMOUNT", value: 500000, minPurchase: 5000000, maxDiscount: 500000, startDate: "2026-01-01", endDate: "2026-12-31", limit: 500, public: true, autoApply: false, priority: 15 },
    { name: "Corporate Discount", type: "CUSTOM", discount: "PERCENTAGE", value: 12, minPurchase: 25000000, maxDiscount: 5000000, startDate: "2026-01-01", endDate: "2026-12-31", limit: 0, public: false, autoApply: false, priority: 25 },
    { name: "Family Package", type: "CUSTOM", discount: "PERCENTAGE", value: 18, minPurchase: 15000000, maxDiscount: 3500000, startDate: "2026-06-01", endDate: "2026-12-31", limit: 100, public: true, autoApply: false, priority: 12 },
    { name: "Umrah Plus Promo", type: "SEASONAL", discount: "PERCENTAGE", value: 20, minPurchase: 20000000, maxDiscount: 6000000, startDate: "2026-08-01", endDate: "2026-10-31", limit: 75, public: true, autoApply: false, priority: 18 },
    { name: "Student Promo", type: "CUSTOM", discount: "FIXED_AMOUNT", value: 750000, minPurchase: 3000000, maxDiscount: 750000, startDate: "2026-01-01", endDate: "2026-12-31", limit: 200, public: true, autoApply: false, priority: 8 },
    { name: "Loyalty Member", type: "LOYALTY", discount: "PERCENTAGE", value: 15, minPurchase: 0, maxDiscount: 2500000, startDate: "2026-01-01", endDate: "2026-12-31", limit: 0, public: false, autoApply: true, priority: 22 },
    { name: "Referral Bonus", type: "REFERRAL", discount: "FIXED_AMOUNT", value: 300000, minPurchase: 0, maxDiscount: 300000, startDate: "2026-01-01", endDate: "2026-12-31", limit: 1000, public: true, autoApply: false, priority: 6 },
    { name: "Year End Promo", type: "SEASONAL", discount: "PERCENTAGE", value: 22, minPurchase: 0, maxDiscount: 7000000, startDate: "2026-10-01", endDate: "2026-12-31", limit: 150, public: true, autoApply: true, priority: 28 },
    { name: "Special Saudi Season", type: "SEASONAL", discount: "PERCENTAGE", value: 18, minPurchase: 12000000, maxDiscount: 4000000, startDate: "2026-03-01", endDate: "2026-05-31", limit: 100, public: true, autoApply: false, priority: 16 },
    { name: "Executive Package Promo", type: "CUSTOM", discount: "PERCENTAGE", value: 15, minPurchase: 30000000, maxDiscount: 8000000, startDate: "2026-04-01", endDate: "2026-11-30", limit: 50, public: true, autoApply: false, priority: 14 },
    { name: "Custom Campaign", type: "CUSTOM", discount: "FIXED_AMOUNT", value: 1000000, minPurchase: 5000000, maxDiscount: 1000000, startDate: "2026-01-01", endDate: "2026-12-31", limit: 0, public: false, autoApply: false, priority: 1 },
    { name: "Holiday Flash Sale", type: "FLASH_SALE", discount: "PERCENTAGE", value: 30, minPurchase: 0, maxDiscount: 7500000, startDate: "2026-05-01", endDate: "2026-05-07", limit: 30, public: true, autoApply: true, priority: 35 },
  ]

  let promotionCount = 0
  for (const p of promotionData) {
    const slug = p.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const existing = await db.promotion.findUnique({ where: { slug } })
    if (!existing) {
      const num = promotionData.indexOf(p) + 1
      await db.promotion.create({
        data: {
          code: `PRO-${String(num).padStart(3, "0")}`,
          slug,
          name: p.name,
          description: `${p.name} - ${p.discount === "PERCENTAGE" ? `${p.value}%` : `Rp${p.value.toLocaleString("id-ID")}`} discount`,
          promotionType: p.type,
          discountType: p.discount,
          discountValue: p.value,
          minimumPurchaseAmount: p.minPurchase,
          maximumDiscountAmount: p.maxDiscount,
          startDate: new Date(p.startDate),
          endDate: new Date(p.endDate),
          usageLimit: p.limit,
          usedCount: 0,
          isPublic: p.public,
          isAutoApply: p.autoApply,
          priority: p.priority,
          status: "ACTIVE",
        },
      })
      promotionCount++
    } else {
      promotionCount++
    }
  }

  let visaCount = 0
  let visaCodeCounter = 1
  const visaStatuses = ["ACTIVE"] as const
  for (const v of visaData) {
    const existing = await db.visa.findUnique({ where: { slug: v.slug } })
    if (!existing) {
      await db.visa.create({
        data: {
          code: `VIS-${String(visaCodeCounter).padStart(3, "0")}`,
          slug: v.slug,
          name: v.name,
          countryId: createdCountries[v.countrySlug],
          visaType: v.type,
          entryType: v.entry,
          processingDays: v.processing,
          validityDays: v.validity,
          stayDurationDays: v.stay,
          isElectronic: v.electronic,
          sortOrder: v.sortOrder,
          status: "ACTIVE",
        },
      })
      visaCodeCounter++
      visaCount++
    } else {
      visaCount++
    }
  }

  let categoryCount = 0
  const categoryData = [
    { name: "Reguler", shortName: "REG", description: "Paket reguler standar dengan fasilitas dasar", displayOrder: 1, icon: "Briefcase", color: "blue", featured: true },
    { name: "Executive", shortName: "EXE", description: "Paket eksekutif dengan layanan premium", displayOrder: 2, icon: "Crown", color: "amber", featured: true },
    { name: "Luxury", shortName: "LX", description: "Paket luxury dengan fasilitas mewah", displayOrder: 3, icon: "Star", color: "purple", featured: true },
    { name: "VIP", shortName: "VIP", description: "Paket VIP dengan prioritas layanan eksklusif", displayOrder: 4, icon: "Users", color: "rose", featured: true },
    { name: "Private", shortName: "PVT", description: "Paket private untuk grup kecil atau individu", displayOrder: 5, icon: "Heart", color: "emerald", featured: false },
    { name: "Corporate", shortName: "CORP", description: "Paket korporasi untuk perjalanan bisnis", displayOrder: 6, icon: "Building", color: "cyan", featured: false },
    { name: "Family", shortName: "FAM", description: "Paket keluarga dengan harga spesial", displayOrder: 7, icon: "Users", color: "orange", featured: false },
    { name: "Honeymoon", shortName: "HONEY", description: "Paket bulan madu romantis", displayOrder: 8, icon: "Heart", color: "rose", featured: false },
    { name: "Student", shortName: "STD", description: "Paket pelajar dengan budget hemat", displayOrder: 9, icon: "Map", color: "blue", featured: false },
    { name: "Backpacker", shortName: "BP", description: "Paket backpacker untuk petualangan mandiri", displayOrder: 10, icon: "Map", color: "orange", featured: false },
    { name: "Premium", shortName: "PREMIUM", description: "Paket premium dengan layanan terbaik", displayOrder: 11, icon: "Award", color: "amber", featured: true },
    { name: "Custom", shortName: "CUST", description: "Paket kustom sesuai kebutuhan khusus", displayOrder: 12, icon: "Gem", color: "purple", featured: false },
  ]

  for (const c of categoryData) {
    const slug = c.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const existing = await db.packageCategory.findUnique({ where: { slug } })
    if (!existing) {
      const num = categoryData.indexOf(c) + 1
      await db.packageCategory.create({
        data: {
          code: `CAT-${String(num).padStart(3, "0")}`,
          slug,
          name: c.name,
          shortName: c.shortName,
          description: c.description,
          displayOrder: c.displayOrder,
          icon: c.icon,
          color: c.color,
          isFeatured: c.featured,
          status: "ACTIVE",
        },
      })
      categoryCount++
    } else {
      categoryCount++
    }
  }

  let typeCount = 0
  const packageTypeData = [
    { name: "Umrah", shortName: "UMRAH", duration: 9, visaSlug: "umrah-visa", catSlug: "reguler", icon: "Plane", color: "blue", featured: true, order: 1 },
    { name: "Umrah Plus", shortName: "UMPLUS", duration: 12, visaSlug: null, catSlug: "executive", icon: "Crown", color: "amber", featured: true, order: 2 },
    { name: "Hajj", shortName: "HAJJ", duration: 30, visaSlug: "hajj-visa", catSlug: null, icon: "Map", color: "green", featured: true, order: 3 },
    { name: "Muslim Tour", shortName: "TOUR", duration: 7, visaSlug: null, catSlug: null, icon: "Globe", color: "emerald", featured: false, order: 4 },
    { name: "Land Arrangement", shortName: "LAND", duration: 0, visaSlug: null, catSlug: null, icon: "Building", color: "cyan", featured: false, order: 5 },
    { name: "Visa Only", shortName: "VISA", duration: 0, visaSlug: "umrah-visa", catSlug: null, icon: "Passport", color: "purple", featured: false, order: 6 },
    { name: "Hotel Only", shortName: "HOTEL", duration: 0, visaSlug: null, catSlug: null, icon: "Hotel", color: "orange", featured: false, order: 7 },
    { name: "Transportation Only", shortName: "TRANS", duration: 0, visaSlug: null, catSlug: null, icon: "Plane", color: "blue", featured: false, order: 8 },
    { name: "Corporate Travel", shortName: "CORP", duration: 5, visaSlug: null, catSlug: "corporate", icon: "Users", color: "rose", featured: false, order: 9 },
    { name: "Private Tour", shortName: "PRIV", duration: 7, visaSlug: null, catSlug: "private", icon: "Award", color: "amber", featured: false, order: 10 },
    { name: "Educational Tour", shortName: "EDU", duration: 10, visaSlug: null, catSlug: null, icon: "BookOpen", color: "cyan", featured: false, order: 11 },
    { name: "Custom Package", shortName: "CUST", duration: 0, visaSlug: null, catSlug: "custom", icon: "Gem", color: "purple", featured: false, order: 12 },
  ]

  for (const p of packageTypeData) {
    const slug = p.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const existing = await db.packageType.findUnique({ where: { slug } })
    if (!existing) {
      const num = packageTypeData.indexOf(p) + 1
      let visaId: string | null = null
      let catId: string | null = null
      if (p.visaSlug) {
        const visa = await db.visa.findUnique({ where: { slug: p.visaSlug } })
        if (visa) visaId = visa.id
      }
      if (p.catSlug) {
        const cat = await db.packageCategory.findUnique({ where: { slug: p.catSlug } })
        if (cat) catId = cat.id
      }
      await db.packageType.create({
        data: {
          code: `TYPE-${String(num).padStart(3, "0")}`,
          slug,
          name: p.name,
          shortName: p.shortName,
          defaultDurationDays: p.duration,
          defaultVisaId: visaId,
          defaultCategoryId: catId,
          icon: p.icon,
          color: p.color,
          displayOrder: p.order,
          isFeatured: p.featured,
          status: "ACTIVE",
        },
      })
      typeCount++
    } else {
      typeCount++
    }
  }

  let tagCount = 0
  const tagData = [
    { name: "Best Seller", shortName: "BEST", icon: "Star", color: "amber", order: 1 },
    { name: "Popular", shortName: "POP", icon: "Flame", color: "orange", order: 2 },
    { name: "Limited Seat", shortName: "LIMIT", icon: "Clock", color: "red", order: 3 },
    { name: "Promo", shortName: "PROMO", icon: "BadgePercent", color: "green", order: 4 },
    { name: "Recommended", shortName: "REC", icon: "Award", color: "blue", order: 5 },
    { name: "Luxury", shortName: "LX", icon: "Gem", color: "purple", order: 6 },
    { name: "Economy", shortName: "ECO", icon: "Tag", color: "emerald", order: 7 },
    { name: "Premium", shortName: "PREMIUM", icon: "Crown", color: "amber", order: 8 },
    { name: "Executive", shortName: "EXEC", icon: "Briefcase", color: "indigo", order: 9 },
    { name: "VIP", shortName: "VIP", icon: "Star", color: "rose", order: 10 },
    { name: "Featured", shortName: "FEAT", icon: "Sparkles", color: "amber", order: 11 },
    { name: "Trending", shortName: "TREND", icon: "Flame", color: "red", order: 12 },
    { name: "Campaign", shortName: "CAMP", icon: "Megaphone", color: "blue", order: 13 },
    { name: "Flash Sale", shortName: "FLASH", icon: "Zap", color: "orange", order: 14 },
    { name: "Early Bird", shortName: "BIRD", icon: "Sun", color: "amber", order: 15 },
    { name: "New", shortName: "NEW", icon: "Sparkles", color: "green", order: 16 },
    { name: "Hot", shortName: "HOT", icon: "Flame", color: "red", order: 17 },
    { name: "Direct Flight", shortName: "DIRECT", icon: "Plane", color: "blue", order: 18 },
    { name: "Transit", shortName: "TRANSIT", icon: "Plane", color: "cyan", order: 19 },
    { name: "Family Friendly", shortName: "FAM", icon: "Users", color: "emerald", order: 20 },
    { name: "Private Trip", shortName: "PRIV", icon: "Heart", color: "rose", order: 21 },
    { name: "Group Tour", shortName: "GROUP", icon: "Users", color: "purple", order: 22 },
    { name: "Weekend", shortName: "WKEN", icon: "Sun", color: "orange", order: 23 },
    { name: "Ramadhan", shortName: "RMD", icon: "Moon", color: "purple", order: 24 },
    { name: "School Holiday", shortName: "SCHOOL", icon: "Sun", color: "amber", order: 25 },
    { name: "Corporate", shortName: "CORP", icon: "Building", color: "indigo", order: 26 },
    { name: "Exclusive", shortName: "EXCL", icon: "Award", color: "rose", order: 27 },
    { name: "Paket Hemat", shortName: "HEMAT", icon: "Tag", color: "green", order: 28 },
    { name: "Paket Lengkap", shortName: "LENGKAP", icon: "Star", color: "blue", order: 29 },
    { name: "Paket Terlaris", shortName: "LARIS", icon: "Flame", color: "orange", order: 30 },
  ]

  for (const t of tagData) {
    const slug = t.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const existing = await db.tag.findUnique({ where: { slug } })
    if (!existing) {
      const num = tagData.indexOf(t) + 1
      await db.tag.create({
        data: {
          code: `TAG-${String(num).padStart(3, "0")}`,
          slug,
          name: t.name,
          shortName: t.shortName,
          icon: t.icon,
          color: t.color,
          displayOrder: t.order,
          status: "ACTIVE",
        },
      })
      tagCount++
    } else {
      tagCount++
    }
  }

  const businessSettingsData = [
    { key: "general.app_name", label: "Application Name", group: "GENERAL", value: "STMS", valueType: "STRING", description: "System application name", isPublic: true, sortOrder: 1 },
    { key: "general.app_url", label: "Application URL", group: "GENERAL", value: "https://safiq-tms.com", valueType: "STRING", description: "Public application URL", isPublic: true, sortOrder: 2 },
    { key: "general.admin_email", label: "Admin Email", group: "GENERAL", value: "admin@safiq.com", valueType: "STRING", description: "System administrator email", sortOrder: 3 },
    { key: "general.support_phone", label: "Support Phone", group: "GENERAL", value: "+6221123456", valueType: "STRING", description: "Customer support phone number", isPublic: true, sortOrder: 4 },
    { key: "general.maintenance_mode", label: "Maintenance Mode", group: "GENERAL", value: "false", valueType: "BOOLEAN", description: "Enable system maintenance mode", sortOrder: 5 },
    { key: "general.default_locale", label: "Default Locale", group: "GENERAL", value: "id", valueType: "STRING", description: "Default system language", sortOrder: 6 },
    { key: "general.default_timezone", label: "Default Timezone", group: "GENERAL", value: "Asia/Jakarta", valueType: "STRING", description: "Default system timezone", sortOrder: 7 },
    { key: "company.name", label: "Company Name", group: "COMPANY", value: "PT Safiq Tour", valueType: "STRING", description: "Legal company name", sortOrder: 8 },
    { key: "company.address", label: "Company Address", group: "COMPANY", value: "Jl. Merdeka No. 1, Jakarta", valueType: "TEXT", description: "Company headquarters address", isPublic: true, sortOrder: 9 },
    { key: "company.phone", label: "Company Phone", group: "COMPANY", value: "+62219876543", valueType: "STRING", description: "Company main phone number", isPublic: true, sortOrder: 10 },
    { key: "company.email", label: "Company Email", group: "COMPANY", value: "info@safiq.com", valueType: "STRING", description: "Company public email", isPublic: true, sortOrder: 11 },
    { key: "company.tax_id", label: "Tax ID (NPWP)", group: "COMPANY", value: "01.234.567.8-999.999", valueType: "STRING", description: "Company tax identification number", sortOrder: 12 },
    { key: "company.website", label: "Company Website", group: "COMPANY", value: "https://safiq-tms.com", valueType: "STRING", description: "Official company website", isPublic: true, sortOrder: 13 },
    { key: "company.logo_url", label: "Company Logo URL", group: "COMPANY", value: "/images/logo.png", valueType: "STRING", description: "Company logo image path", isPublic: true, sortOrder: 14 },
    { key: "package.default_duration", label: "Default Package Duration", group: "PACKAGE", value: "7", valueType: "NUMBER", description: "Default tour duration in days", sortOrder: 15 },
    { key: "package.max_pax", label: "Max Pax Per Package", group: "PACKAGE", value: "200", valueType: "NUMBER", description: "Maximum participants per package", sortOrder: 16 },
    { key: "package.min_pax", label: "Min Pax Per Package", group: "PACKAGE", value: "10", valueType: "NUMBER", description: "Minimum participants per package", sortOrder: 17 },
    { key: "package.early_booking_days", label: "Early Booking Days", group: "PACKAGE", value: "90", valueType: "NUMBER", description: "Days before departure for early booking", sortOrder: 18 },
    { key: "booking.cancel_window", label: "Cancellation Window (Days)", group: "BOOKING", value: "14", valueType: "NUMBER", description: "Free cancellation period in days", sortOrder: 19 },
    { key: "booking.deposit_percentage", label: "Deposit Percentage", group: "BOOKING", value: "30", valueType: "NUMBER", description: "Required down payment percentage", sortOrder: 20 },
    { key: "booking.max_installments", label: "Max Installments", group: "BOOKING", value: "6", valueType: "NUMBER", description: "Maximum number of installment payments", sortOrder: 21 },
    { key: "finance.currency_base", label: "Base Currency", group: "FINANCE", value: "IDR", valueType: "STRING", description: "Default base currency code", sortOrder: 22 },
    { key: "finance.tax_percentage", label: "Tax Percentage", group: "FINANCE", value: "11", valueType: "NUMBER", description: "PPN tax rate percentage", sortOrder: 23 },
    { key: "finance.admin_fee_percentage", label: "Admin Fee Percentage", group: "FINANCE", value: "3", valueType: "NUMBER", description: "Administration fee percentage", sortOrder: 24 },
    { key: "finance.rounding_method", label: "Rounding Method", group: "FINANCE", value: "nearest", valueType: "STRING", description: "Price rounding method (nearest/up/down)", sortOrder: 25 },
    { key: "system.session_timeout", label: "Session Timeout (Minutes)", group: "SYSTEM", value: "60", valueType: "NUMBER", description: "User session timeout duration", sortOrder: 26, isReadonly: true },
    { key: "system.max_login_attempts", label: "Max Login Attempts", group: "SYSTEM", value: "5", valueType: "NUMBER", description: "Failed login attempts before lockout", sortOrder: 27, isReadonly: true },
    { key: "system.password_min_length", label: "Min Password Length", group: "SYSTEM", value: "8", valueType: "NUMBER", description: "Minimum password character length", sortOrder: 28, isReadonly: true },
    { key: "system.jwt_expiry", label: "JWT Token Expiry (Hours)", group: "SYSTEM", value: "24", valueType: "NUMBER", description: "JWT authentication token lifetime", sortOrder: 29, isReadonly: true },
    { key: "email.smtp_host", label: "SMTP Host", group: "EMAIL", value: "smtp.sendgrid.net", valueType: "STRING", description: "SMTP server hostname", sortOrder: 30 },
    { key: "email.smtp_port", label: "SMTP Port", group: "EMAIL", value: "587", valueType: "NUMBER", description: "SMTP server port", sortOrder: 31 },
    { key: "email.smtp_username", label: "SMTP Username", group: "EMAIL", value: "apikey", valueType: "STRING", description: "SMTP authentication username", sortOrder: 32 },
    { key: "email.from_name", label: "From Name", group: "EMAIL", value: "Safiq Tour", valueType: "STRING", description: "Default sender display name", sortOrder: 33 },
    { key: "email.from_address", label: "From Address", group: "EMAIL", value: "noreply@safiq.com", valueType: "STRING", description: "Default sender email address", sortOrder: 34 },
    { key: "whatsapp.api_url", label: "WhatsApp API URL", group: "WHATSAPP", value: "https://api.whatsapp.com/send", valueType: "STRING", description: "WhatsApp API endpoint", sortOrder: 35 },
    { key: "whatsapp.api_token", label: "WhatsApp API Token", group: "WHATSAPP", value: "", valueType: "STRING", description: "WhatsApp API authentication token", sortOrder: 36 },
    { key: "whatsapp.default_number", label: "Default Phone Number", group: "WHATSAPP", value: "+6281234567890", valueType: "STRING", description: "Default WhatsApp business number", isPublic: true, sortOrder: 37 },
    { key: "cms.home_hero_title", label: "Home Hero Title", group: "CMS", value: "Perjalanan Ibadah Terpercaya", valueType: "STRING", description: "Homepage hero section title", isPublic: true, sortOrder: 38 },
    { key: "cms.home_hero_subtitle", label: "Home Hero Subtitle", group: "CMS", value: "Kami hadir untuk mewujudkan perjalanan ibadah Anda", valueType: "STRING", description: "Homepage hero section subtitle", isPublic: true, sortOrder: 39 },
    { key: "cms.footer_about", label: "Footer About Text", group: "CMS", value: "Safiq Tour Management System", valueType: "TEXT", description: "Footer about section", isPublic: true, sortOrder: 40 },
  ]

  let bsCount = 0
  for (const bs of businessSettingsData) {
    const existing = await db.businessSetting.findUnique({ where: { key: bs.key } })
    if (!existing) {
      await db.businessSetting.create({ data: bs })
      bsCount++
    } else {
      bsCount++
    }
  }

  console.log(`  - ${tagCount} tags`)
  console.log(`  - ${typeCount} package types`)
  console.log(`  - ${categoryCount} package categories`)
  console.log("Seed completed successfully!")
  console.log(`  - ${rolesData.length} roles`)
  console.log(`  - ${allPermissions.length} permissions`)
  console.log(`  - ${usersData.length} users`)
  console.log(`  - ${settingsData.length} settings`)
  console.log(`  - ${destinationTypes.length} destination types`)
  console.log(`  - ${countries.length} countries`)
  console.log(`  - ${regions.length} regions`)
  console.log(`  - ${cities.length} cities`)
  console.log(`  - ${destinations.length} destinations`)
  console.log(`  - ${folderNames.length} media folders`)
  console.log(`  - ${amenityNames.length} hotel amenities`)
  console.log(`  - ${hotelData.length} hotels`)
  console.log(`  - ${airlineData.length} airlines`)
  console.log(`  - ${transportationData.length} transportations`)
  console.log(`  - ${facilityData.length} facilities`)
  console.log(`  - ${visaCount} visas`)
  console.log(`  - ${currencyCount} currencies`)
  console.log(`  - ${promotionCount} promotions`)
  console.log(`  - ${bsCount} business settings`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
