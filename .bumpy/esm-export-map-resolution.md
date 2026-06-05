---
"@saeris/configs": patch
---

Fix package resolution by flattening the export map so bundlers can resolve @saeris/configs under both import and require conditions (resolves 'ESM only but loaded by require' errors in consumer vite configs)
