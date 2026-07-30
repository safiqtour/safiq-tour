# ERD — Transaction

## Entity List

### Package
- **Purpose**: Data paket umroh
- **PK**: id (UUID)
- **FK**: categoryId → PackageCategory.id, createdById → User.id
- **Index**: slug, status, featured, categoryId
- **Fields**: id, title, slug, excerpt, description, categoryId, duration, price, promoPrice, currency, airline, quota, seatFilled, status (DRAFT/PUBLISHED/ARCHIVED), featured, badge, thumbnail, heroImage, metaTitle, metaDescription, keywords, publishedAt, createdById, createdAt, updatedAt
- **Relationships**: belongs to Category, belongs to Creator (User), has many PackageDestinations, has many PackageHotels, has many PackageGalleries, has many PackageFacilities, has many PackageItineraries, has many PackageSchedules, has many Bookings

### PackageDestination
- **Purpose**: Destinasi yang dikunjungi dalam paket
- **PK**: id (UUID)
- **FK**: packageId → Package.id, destinationId → Destination.id
- **Index**: packageId, destinationId
- **Fields**: id, packageId, destinationId, day, sortOrder, createdAt
- **Relationships**: belongs to Package, belongs to Destination

### PackageHotel
- **Purpose**: Hotel dalam paket
- **PK**: id (UUID)
- **FK**: packageId → Package.id, hotelId → Hotel.id
- **Index**: packageId, type
- **Fields**: id, packageId, hotelId, type (MEKKAH/MADINAH), checkIn, checkOut, createdAt, updatedAt
- **Relationships**: belongs to Package, belongs to Hotel

### PackageGallery
- **Purpose**: Galeri gambar paket
- **PK**: id (UUID)
- **FK**: packageId → Package.id, mediaId → Media.id
- **Index**: packageId, sortOrder
- **Fields**: id, packageId, mediaId, alt, sortOrder, createdAt
- **Relationships**: belongs to Package, belongs to Media

### PackageFacility
- **Purpose**: Fasilitas dalam paket
- **PK**: id (UUID)
- **FK**: packageId → Package.id, facilityId → Facility.id
- **Index**: packageId
- **Fields**: id, packageId, facilityId, name, icon, createdAt
- **Relationships**: belongs to Package, belongs to Facility (optional)

### PackageItinerary
- **Purpose**: Itinerary / jadwal harian paket
- **PK**: id (UUID)
- **FK**: packageId → Package.id
- **Index**: packageId, day
- **Fields**: id, packageId, day, title, description, image, createdAt, updatedAt
- **Relationships**: belongs to Package

### PackageSchedule
- **Purpose**: Jadwal keberangkatan paket
- **PK**: id (UUID)
- **FK**: packageId → Package.id
- **Index**: packageId, departureDate
- **Fields**: id, packageId, departureDate, returnDate, meetingPoint, seat, seatFilled, status (OPEN/CLOSED/FULL), createdAt, updatedAt
- **Relationships**: belongs to Package, has many Bookings

### Booking
- **Purpose**: Data pemesanan paket
- **PK**: id (UUID)
- **FK**: packageId → Package.id, scheduleId → PackageSchedule.id, createdById → User.id
- **Index**: bookingNumber, packageId, scheduleId, status
- **Fields**: id, bookingNumber, packageId, scheduleId, status (LEAD/PROSPECT/BOOKED/ACTIVE/PAID/DEPARTED/COMPLETED/CANCELLED), totalPrice, discountAmount, finalPrice, notes, createdById, createdAt, updatedAt
- **Relationships**: belongs to Package, belongs to Schedule, belongs to CreatedBy (User), has many Pilgrims, has many Payments, has one Invoice

### Pilgrim
- **Purpose**: Data jamaah dalam booking
- **PK**: id (UUID)
- **FK**: bookingId → Booking.id
- **Index**: bookingId, passportNumber, email
- **Fields**: id, bookingId, name, nickName, email, phone, birthPlace, birthDate, gender, address, cityId, passportNumber, passportExpiry, passportImage, relationship (SELF/SPOUSE/FAMILY), isActive, createdAt, updatedAt
- **Relationships**: belongs to Booking, has many Documents

### Payment
- **Purpose**: Data pembayaran
- **PK**: id (UUID)
- **FK**: bookingId → Booking.id, verifiedById → User.id
- **Index**: bookingId, status, paymentDate
- **Fields**: id, bookingId, amount, method (TRANSFER/VA/GATEWAY/CASH), status (UNPAID/WAITING_VERIFICATION/PARTIAL/PAID/REFUNDED), proofImage, notes, verifiedById, verifiedAt, paymentDate, createdAt, updatedAt
- **Relationships**: belongs to Booking, belongs to VerifiedBy (User)

### Invoice
- **Purpose**: Data invoice
- **PK**: id (UUID)
- **FK**: bookingId → Booking.id
- **Index**: invoiceNumber, bookingId
- **Fields**: id, invoiceNumber, bookingId, totalAmount, paidAmount, remainingAmount, dueDate, status (UNPAID/PARTIAL/PAID/OVERDUE/CANCELLED), issuedAt, createdAt, updatedAt
- **Relationships**: belongs to Booking

### Document
- **Purpose**: Dokumen jamaah (passport, visa, etc.)
- **PK**: id (UUID)
- **FK**: pilgrimId → Pilgrim.id, uploadedById → User.id
- **Index**: pilgrimId, type
- **Fields**: id, pilgrimId, type (PASSPORT/VISA/VACCINE/PHOTO/KK/NIKAH), status (PENDING/COLLECTED/VERIFIED/REJECTED/SUBMITTED), mediaId, notes, uploadedById, verifiedById, verifiedAt, createdAt, updatedAt
- **Relationships**: belongs to Pilgrim, belongs to Media
