# ELME Bazaar API Documentation

Base URL (local): `http://localhost:5000/api`

All responses follow a consistent envelope:

```json
{
  "success": true,
  "message": "optional human-readable message",
  "data": {},
  "pagination": { "...": "only present on paginated list endpoints" },
  "errors": ["...", "only present on validation failures"]
}