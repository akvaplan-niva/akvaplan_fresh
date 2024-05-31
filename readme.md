# akvaplan_fresh

[Akvaplan-niva](https://akvaplan.no/) company website

- HTML-first multi-page web app
- Server-side rendered in Deno [Deploy](https://deno.com/deploy/) – fully
  functional without JavaScript
- Bilingual, including translated/SEO URLs

## Tech stack

- [Deno](https://deno.land/)
- [KV](https://deno.com/kv/)
- [Fresh](https://fresh.deno.dev/)
- [Preact](https://preactjs.com/)
- [Orama](https://oramasearch.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Development

Start development server:

```sh
deno task dev
```

## KV

Connect to preview or production database, by setting env variables
`deno_kv_database` and `DENO_KV_ACCESS_TOKEN` in `.env`:

```
deno_kv_database=https://api.deno.com/databases/$preview/connect
DENO_KV_ACCESS_TOKEN=
```

### Panels

Export/seed

```sh
./bin/kv_list '["panel"]' |  nd-map d.value > data/seed/panels.ndjson
deno task kv-seed
```

### User preferences

```sh
deno task kv_set '["@", "config", "nmi"]' '{"search":{"enabled":true,"exclude":["person","pubs"]},"cristin":{"enabled":true}}'
```
