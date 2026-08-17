# Security — Permission Matrix

## Legend
CRUD = Create, Read, Update, Delete

| Resource | SUPER_ADMIN | ADMIN | FINANCE | MARKETING | CS | MUTHOWIF |
|----------|-------------|-------|---------|-----------|----|----------|
| user | CRUD | R | — | — | — | — |
| role | CRUD | R | — | — | — | — |
| master (country, city, etc) | CRUD | CRUD | R | R | R | — |
| package | CRUD | CRUD | R | R | R | R |
| booking | CRUD | CRUD | R | R | CRUD | R |
| pilgrim | CRUD | CRUD | R | — | CRUD | R |
| payment | CRUD | R | CRUD | — | R | — |
| invoice | CRUD | R | CRUD | — | — | — |
| document | CRUD | CRUD | R | — | CRUD | R |
| cms (article, category) | CRUD | CRUD | — | CRUD | — | — |
| media | CRUD | CRUD | — | CRUD | R | — |
| marketing (promo, testimonial) | CRUD | CRUD | — | CRUD | — | — |
| dashboard | CRUD | CRUD | R | R | R | R |
| setting | CRUD | — | — | — | — | — |
| activity_log | CRUD | R | — | — | — | — |
