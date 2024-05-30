# akvaplan_fresh

[Akvaplan-niva](https://akvaplan.no/) company website

- HTML-first multi-page web app
- Rendered on the fly in Deno [Deploy](https://deno.com/deploy/)
- Fully functional without JavaScript
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

### Panels

Export/seed


```
$ ./bin/kv_list '["panel"]' |  nd-map d.value > data/seed/panels.ndjson
$
```



### User preferences

```sh
$ deno task kv_set '["@", "config", "nmi"]' '{"search":{"enabled":true,"exclude":["person","pubs"]},"cristin":{"enabled":true}}'
```

Better with /:id (and not -:id) in order to isolate from slug with - Intl objl
like name: {en,no}

In most cases related items sjhould e pulled in client side
