# akvaplan_fresh

[Akvaplan-niva](https://akvaplan.no/) company website

- HTML-first multi-page web app
- Rendered on the fly in Deno Deploy (global edge compute)
- Fully functional without JavaScript
- Bilingual, including translated/SEO URLs

## Tech stack

- [Deno](https://deno.land/)
- [Deploy](https://deno.com/deploy/)
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

### User preferences

```sh
$ deno task kv_set '["@", "config", "nmi"]' '{"search":{"enabled":true,"exclude":["person","pubs"]},"cristin":{"enabled":true}}'
```
