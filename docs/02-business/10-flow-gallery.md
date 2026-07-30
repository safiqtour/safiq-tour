# Flow Gallery

## Alur Manajemen Gallery

`
Admin mengakses media library
        ↓
Upload foto/video
        ↓
Validasi: format, ukuran, dimensi
        ↓
File diupload ke storage (Cloudinary/R2/S3)
        ↓
Metadata disimpan di database (url, filename, size, mimeType)
        ↓
Pengelompokan:
  - Album galeri
  - Gallery paket umroh
  - Slider / hero images
  - Testimoni
`

## Aturan Gallery

1. Format yang didukung: JPG, PNG, WEBP, MP4 (video)
2. Maksimum ukuran file: 5MB (foto), 20MB (video)
3. Wajib memiliki alt text untuk aksesibilitas
4. Thumbnail digenerate otomatis
5. Gambar dapat di-crop/resize via storage provider
6. Gallery dapat memiliki sort order
