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

## Intl

The app is server-rendered in one of two locales (`en` or `no`).

### Locale detection

For requests to `/` the browser's list of accepted languages is used to pick
locale (see [_middleware.tsx](routes/_middleware.tsx)).

Users are then redirected to either `/en` or `/no` and served the `Home` route.

```ts
// routes/home.tsx
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};
```

All regular HTML-routes starts with a language segment, which is used to set the
app's `lang` signal for use in translation.

### Translations

In TSX, use the translation function `t` to lookup a text string in the present
language.

```tsx
import { t } from "akvaplan_fresh/text/mod.ts";
<p>{
  t(`some.prefix.some.key`);
}</p>
```

Translations are kept in a simple (key-value) JSON file for each locale.

## KV

Connect to preview or production database, by setting env variables
`deno_kv_database` and `DENO_KV_ACCESS_TOKEN` in `.env`:

```
deno_kv_database=https://api.deno.com/databases/$preview/connect
DENO_KV_ACCESS_TOKEN=
```

## Namespaces

```
["@","config"]
["@","config"]
["page","home"]
["panel","01hwq488byaejre7jt7fq12c4p"]
["rights","kv"]
["rights","kv"]
["rights","kv"]
```

### Permissions

Rights are set using a system, resource, email list, with permitted actions
("crud") like:

```sh
$ ./bin/kv_set '["rights","kv","panel","xyz@akvaplan.niva.no"]' '{"actions":"cru"}'
```

### Panels

Export/seed

```sh
./bin/kv_list '["panel"]' |  nd-map d.value > data/seed/panels.ndjson
deno task kv-seed

# h$ ./bin/kv_list '[]' | nd-filter '!/(mynewsdesk|avatar|sessions)/.test(JSON.stringify(d.key))' > data/kv_export/2024-06-20.ndjson
```

From research topics

```sh
ndjson-cat data/orama/2024-04-30_research_topics.json | ndjson-split  | nd-map '{id,text,intl: {name}}=d, intl={ no: { title: name.no}, en: { title: name.en } }, { id, theme: "dark", backdrop: true, image: { cloudinary: "snlcxc38hperptakjpi5" }, ...d, intl, comment: text, draft: true}' >> data/seed/panels.ndjson
```

### User preferences

```sh
deno task kv_set '["@", "config", "nmi"]' '{"search":{"enabled":true,"exclude":["person","pubs"]},"cristin":{"enabled":true}}'
```
