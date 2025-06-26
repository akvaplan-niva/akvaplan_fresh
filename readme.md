# akvaplan_fresh

[Akvaplan-niva](https://akvaplan.no/) company website

- HTML-first multi-page web app
- Server-side rendered in Deno [Deploy](https://deno.com/deploy/)
- Bilingual, featuring translated and search-engine friendly URLs

## Tech stack

- [Deno](https://deno.land/)
- [Fresh](https://fresh.deno.dev/)
- [KV](https://deno.com/kv/)
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

Most routes start with a language segment, used to set the app's `lang` signal
for use in translation.

```ts
// routes/home.tsx
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};
```

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

### Export

```sh
$ ./bin/kv_list '[]' | nd-filter '!/^(avatar|mynewsdesk|session_user|site_sessions)/.test(d.key[0])' > data/kv_export/prod.ndjson
```

### Permissions

Rights are set using a system, resource, email list, with permitted actions
("crud") like:

```sh
$ ./bin/kv_set '["rights","kv","panel","xyz@akvaplan.niva.no"]' '{"actions":"cru"}'
```
