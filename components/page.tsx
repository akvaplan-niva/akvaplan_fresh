import { ApnSym, CleanHeader, Footer as SiteFooter, Styles } from "./mod.ts";

import { base as baseForLang, lang, t } from "akvaplan_fresh/text/mod.ts";
import { buildInitTheming } from "akvaplan_fresh/theming/mod.ts";

import { Head } from "$fresh/runtime.ts";
import { FunctionComponent, JSX } from "preact";

//import { computed } from "@preact/signals-core";
import { type StringSignal } from "akvaplan_fresh/@interfaces/signal.ts";
//import { symbolDataURI } from "akvaplan_fresh/components/akvaplan/symbol.tsx";

export type StdProps =
  & JSX.HTMLAttributes<HTMLElement>
  & {
    title?: string;
    base?: string | StringSignal;
    lang?: string | StringSignal;
    Header?: FunctionComponent;
  };

const slagord = "Fra forskning til verdiskapning";

const slogun = "From research to value creation";

export function Page(
  {
    title,
    base = baseForLang,
    href,
    Header = CleanHeader,
    Footer = SiteFooter,
    Left = null,
    Right = null,
    ...props
  }: StdProps,
) {
  const head = (
    <Head>
      {title ? <title>{title} – Akvaplan-niva</title> : (
        <title>
          Akvaplan-niva – {lang.value === "en" ? slogun : slagord}
        </title>
      )}

      <script
        dangerouslySetInnerHTML={{ __html: buildInitTheming() }}
      />

      <base href={base} />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="color-scheme" content="dark light" />
      <meta
        name="description"
        content={t("meta.description")}
      />

      <link
        rel="icon"
        href="/akvaplan_symbol.svg"
        type="image/svg+xml"
      />

      <Styles />
    </Head>
  );

  const { children, ...propsExceptChildren } = props;
  // var(--size-sm)

  return (
    <>
      {head}

      <body {...propsExceptChildren}>
        <Header href={href} lang={lang.value} />
        <main style={{ minHeight: "100vh", padding: "0 var(--size-3)" }}>
          {children}
        </main>
        <Footer lang={lang.value} />
        <div hidden>
          <ApnSym />
        </div>
      </body>
    </>
  );
}
