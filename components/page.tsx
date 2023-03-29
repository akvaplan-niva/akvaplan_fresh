import { CleanHeader } from "akvaplan_fresh/components/header/clean_header.tsx";
import { Footer } from "./footer.tsx";
import { Styles } from "./styles.tsx";

import { base as baseForLang, lang, t } from "akvaplan_fresh/text/mod.ts";
import { buildInitTheming } from "akvaplan_fresh/theming/mod.ts";

import { FunctionComponent, JSX } from "preact";
import { Head } from "$fresh/runtime.ts";

import { computed } from "@preact/signals-core";
import { symbolDataURI } from "akvaplan_fresh/components/akvaplan/symbol.tsx";
import { StringSignal } from "akvaplan_fresh/@interfaces/signal.ts";

const nav = computed(() => buildMobileNav(lang));

export type PageProps =
  & JSX.HTMLAttributes<HTMLElement>
  & {
    title?: string;
    base?: string | StringSignal;
    Header?: FunctionComponent;
  };

export function Page(
  {
    title,
    base = baseForLang,
    href,
    ...props
  }: PageProps,
) {
  const head = (
    <Head>
      <meta charset="utf-8" />

      {title
        ? <title>{t(title)} – Akvaplan-niva</title>
        : <title>Akvaplan-niva</title>}

      <script
        dangerouslySetInnerHTML={{ __html: buildInitTheming() }}
      />

      <base href={base} />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* <meta name="color-scheme" content="dark" /> */}
      <meta
        name="description"
        content={t("meta.description")}
      />

      <link
        rel="icon"
        href={symbolDataURI}
        type="image/svg+xml"
      />
      <link rel="stylesheet" href="/css/hscroll.css" />
      <link rel="stylesheet" href="/css/akvaplanist.css" />
      <link rel="stylesheet" href="/css/mini-news.css" />
      <script src="https://static.nrk.no/core-components/major/10/core-scroll/core-scroll.min.js" />

      <Styles />
    </Head>
  );

  const { children, ...propsExceptChildren } = props;
  // var(--size-sm)

  return (
    <>
      {head}

      <body {...propsExceptChildren}>
        <CleanHeader href={href} />
        <main style={{ minHeight: "100vh", padding: "0 var(--size-4)" }}>{children}</main>
        <Footer />
      </body>
    </>
  );
}
