# CSV TO JSON (Kelp Service)

## Implementation 
- Express.js REST API with two endpoints:
  - GET /api/process-csv — parse CSV -> JS objects -> save to DB
  - GET /check-status — simple health check

## Bulk-insert approach 
- Batched multi-row parameterized INSERTs (simpler, reliable):
  - Default batch size: 1000 rows per INSERT (configurable in code)
  - All batches run inside a transaction; COMMIT on success, ROLLBACK on error
  - JSONB fields (address, additional_info) passed as JS objects or null so the driver serializes them
  - Parameterized queries to avoid SQL injection and reduce round-trips

## Design assumptions
- CSV parsed in memory per batch; large files are chunked into user arrays before insert
- Single DB transaction encloses all batches for atomicity

## Project structure 
- config/app.config.js — configuration (port, csv path, batch size)
- config/database.js — Postgres connection & helper (getClient, query)
- controllers/user.controller.js — CSV parsing and batching logic
- models/user.model.js — createTable, truncate, insertUsers (batched INSERT), analytics queries
- index.js — server and routes

## Performance notes
- Batched INSERT reduces client-server round trips vs single-row inserts.
- COPY is faster for very large datasets; batched INSERT is simpler and portable.
