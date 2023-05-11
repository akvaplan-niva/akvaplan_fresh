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
    Left = null,
    Right = null,
    ...props
  }: StdProps,
) {
  const head = (
    <Head>
      {title ? <title>{t(title)} – Akvaplan-niva</title> : (
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

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      {/* <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"> */}

      <Styles />
    </Head>
  );

  const { children, ...propsExceptChildren } = props;
  // var(--size-sm)

  return (
    <>
      {head}

      <body {...propsExceptChildren}>
        <CleanHeader href={href} lang={lang.value} />
        <main style={{ minHeight: "100vh", padding: "0 var(--size-3)" }}>
          {children}
        </main>
        <Footer lang={lang.value} />
      </body>
    </>
  );
}
