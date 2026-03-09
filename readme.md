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

Set the following in `.env`:

```sh
mynewsdesk_key=…
deno_kv_database=…
DENO_KV_ACCESS_TOKEN=…
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

Translations are kept in a simple (key-value) JSON file for each locale.

```tsx
import { t } from "akvaplan_fresh/text/mod.ts";
<p>{
  t(`some.prefix.some.key`);
}</p>
```

## Permissions

Rights are set using a system, resource, email list, with permitted actions
("crud") like:

```sh
$ ./bin/kv_set '["rights","kv","panel","xyz@akvaplan.niva.no"]' '{"actions":"cru"}'
```
