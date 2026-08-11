# ERD — Master Data

## Entity List

### Country
- **Purpose**: Data master negara
- **PK**: id (UUID)
- **FK**: —
- **Index**: name, code
- **Fields**: id, name, code (ISO), phoneCode, flag, isActive, createdAt, updatedAt
- **Relationships**: has many Regions, has many Cities

### Region
- **Purpose**: Provinsi / wilayah dalam negara
- **PK**: id (UUID)
- **FK**: countryId → Country.id
- **Index**: name, countryId
- **Fields**: id, name, countryId, isActive, createdAt, updatedAt
- **Relationships**: belongs to Country, has many Cities

### City
- **Purpose**: Data kota
- **PK**: id (UUID)
- **FK**: countryId → Country.id, regionId → Region.id (optional)
- **Index**: name, countryId
- **Fields**: id, name, countryId, regionId, isActive, createdAt, updatedAt
- **Relationships**: belongs to Country, belongs to Region

### Destination
- **Purpose**: Destinasi / tempat tujuan (Mekkah, Madinah, Jeddah, etc.)
- **PK**: id (UUID)
- **FK**: cityId → City.id
- **Index**: name, cityId
- **Fields**: id, name, slug, description, cityId, image, isActive, createdAt, updatedAt
- **Relationships**: belongs to City

### Hotel
- **Purpose**: Data hotel (Mekkah, Madinah, etc.)
- **PK**: id (UUID)
- **FK**: cityId → City.id
- **Index**: name, cityId, stars
- **Fields**: id, name, slug, description, stars, rating, address, cityId, distance, mapsUrl, image, isActive, createdAt, updatedAt
- **Relationships**: belongs to City

### Airline
- **Purpose**: Data maskapai penerbangan
- **PK**: id (UUID)
- **FK**: —
- **Index**: name, code
- **Fields**: id, name, code (IATA), logo, description, isActive, createdAt, updatedAt
- **Relationships**: used in Package (airlineId), used in PackageFlightSegment, has many AirlineAliases
### AirlineAlias
- **Purpose**: Alias/nama alternatif maskapai untuk pencocokan teks legacy (backfill Package.airline → airlineId)
- **PK**: id (UUID)
- **FK**: airlineId → Airline.id
- **Index**: alias, unique (airlineId, alias)
- **Fields**: id, airlineId, alias, createdAt, updatedAt
- **Relationships**: belongs to Airline



### Transportation
- **Purpose**: Data transportasi darat (bus, travel)
- **PK**: id (UUID)
- **FK**: —
- **Index**: name, type
- **Fields**: id, name, type, capacity, description, isActive, createdAt, updatedAt

### Facility
- **Purpose**: Master fasilitas yang bisa dimiliki paket
- **PK**: id (UUID)
- **FK**: —
- **Index**: name
- **Fields**: id, name, icon, description, isActive, createdAt, updatedAt
- **Relationships**: linked via PackageFacility

### PackageCategory
- **Purpose**: Kategori paket (Ekonomis, Reguler, Executive, VIP, Luxury)
- **PK**: id (UUID)
- **FK**: —
- **Index**: name, slug
- **Fields**: id, name, slug, description, sortOrder, isActive, createdAt, updatedAt
- **Relationships**: has many Packages

### Promo
- **Purpose**: Data promosi dan diskon
- **PK**: id (UUID)
- **FK**: —
- **Index**: code, startDate, endDate
- **Fields**: id, code, name, description, type (PERCENTAGE/FIXED), value, minPurchase, maxDiscount, quota, used, startDate, endDate, isActive, createdAt, updatedAt
- **Relationships**: applied to Packages via PackagePromo

### Visa
- **Purpose**: Jenis visa umroh
- **PK**: id (UUID)
- **FK**: —
- **Index**: name, countryId
- **Fields**: id, name, countryId, description, price, duration, requirements, isActive, createdAt, updatedAt

### Currency
- **Purpose**: Data mata uang
- **PK**: id (UUID)
- **FK**: —
- **Index**: code
- **Fields**: id, name, code, symbol, exchangeRate, isActive, createdAt, updatedAt

### Media
- **Purpose**: File/media asset
- **PK**: id (UUID)
- **FK**: uploadedById → User.id
- **Index**: filename, mimeType
- **Fields**: id, filename, url, thumbnailUrl, mimeType, size, width, height, alt, uploadedById, createdAt, updatedAt
- **Relationships**: belongs to User (uploader)

### Gallery
- **Purpose**: Album galeri
- **PK**: id (UUID)
- **FK**: —
- **Index**: slug
- **Fields**: id, title, slug, description, coverImage, isActive, createdAt, updatedAt
- **Relationships**: has many GalleryItems

### GalleryItem
- **Purpose**: Item dalam galeri
- **PK**: id (UUID)
- **FK**: galleryId → Gallery.id, mediaId → Media.id
- **Index**: galleryId, sortOrder
- **Fields**: id, galleryId, mediaId, caption, sortOrder, createdAt
- **Relationships**: belongs to Gallery, belongs to Media

### TourObject
- **Purpose**: Objek wisata / tempat ziarah
- **PK**: id (UUID)
- **FK**: cityId → City.id
- **Index**: name, cityId
- **Fields**: id, name, slug, description, cityId, latitude, longitude, image, isActive, createdAt, updatedAt

### PackageTag
- **Purpose**: Tag untuk paket (promo, best seller, dll)
- **PK**: id (UUID)
- **FK**: —
- **Index**: name, slug
- **Fields**: id, name, slug, color, isActive, createdAt, updatedAt
