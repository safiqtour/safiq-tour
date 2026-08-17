export type CountryBrief = { id: string; name: string }
export type RegionBrief = { id: string; name: string }
export type CityBrief = { id: string; name: string }
export type DestinationBrief = { id: string; name: string }
export type MediaBrief = { id: string; url: string; thumbnailUrl?: string | null; alt?: string | null }

export type HotelListItem = {
  id: string; name: string; slug: string; starRating: number; status: string
  country?: CountryBrief | null; city?: CityBrief | null
  featuredMedia?: MediaBrief | null
  distanceToHaram?: string
  distanceToNabawi?: string
  mapsUrl?: string
  deletedAt?: Date | string | null
  _count?: { media: number; roomTypes: number; policies: number }
}

export type HotelDetail = HotelListItem & {
  region?: RegionBrief | null
  destination?: DestinationBrief | null
  distanceToHaram: string; distanceToNabawi: string
  address: string; mapsUrl: string; phone: string; email: string; website: string
  shortDescription: string; description: string
  countryId: string; regionId?: string | null; cityId?: string | null; destinationId?: string | null
  featuredMediaId?: string | null
  sortOrder: number
  hotelAmenities?: { amenity: { id: string; name: string; icon: string } }[]
  media?: { mediaId: string; media: MediaBrief; type: string; sortOrder: number }[]
  roomTypes?: { name: string; description: string; price: number; capacity: number; sortOrder: number }[]
  contacts?: { type: string; value: string }[]
  policies?: { type: string; content: string; sortOrder: number }[]
  createdAt?: Date | string; updatedAt?: Date | string
}

export type HotelAmenityItem = { id: string; name: string; icon: string; sortOrder: number }

export type AirlineListItem = {
  id: string; name: string; slug: string; iataCode?: string | null; icaoCode?: string | null
  website: string; callCenter: string; status: string
  countryId?: string | null; logoMediaId?: string | null
  country?: CountryBrief | null; logoMedia?: MediaBrief | null
  deletedAt?: Date | string | null
}

export type TransportationListItem = {
  id: string; name: string; slug: string; type: string; capacity: number; status: string
  description: string; mediaId?: string | null; media?: MediaBrief | null
  deletedAt?: Date | string | null
}
