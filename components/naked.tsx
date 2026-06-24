import {
  ApnSym,
  CleanHeader,
  Footer as SiteFooter,
  LegacyStyles,
} from "./mod.ts";

import { type Breadcrumb } from "@/components/site_nav.tsx";

import { base as baseForLang, lang, t } from "@/text/mod.ts";
import { buildInitTheming } from "@/theming/mod.ts";

import { Head } from "$fresh/runtime.ts";
import { FunctionComponent, JSX } from "preact";

//import { computed } from "@preact/signals-core";
import { type StringSignal } from "@/@interfaces/signal.ts";
import { collectionBreadcrumbs } from "@/services/mod.ts";
import { MorgenStudioStyles } from "@/components/styles.tsx";
//import { symbolDataURI } from "@/components/akvaplan/symbol.tsx";

export type StdProps =
  & JSX.HTMLAttributes<HTMLElement>
  & {
    title?: string;
    base?: string | StringSignal;
    lang?: string | StringSignal;
    Header?: FunctionComponent;
    breadcrumbs: Breadcrumb[];
  };

export function Naked(
  {
    title,
    base = baseForLang,
    href,
    collection,
    breadcrumbs,
    Logo,
    Header = CleanHeader,
    Footer = SiteFooter,
    Left = null,
    Right = null,
    context,
    ...props
  }: StdProps,
) {
  if (!breadcrumbs && collection) {
    breadcrumbs = collectionBreadcrumbs(collection);
  }
  const head = (
    <Head>
      {title ? <title>{title} – Akvaplan-niva</title> : (
        <title>
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

      <LegacyStyles />
      <MorgenStudioStyles />
    </Head>
  );

  const { children, ...propsExceptChildren } = props;
  // var(--size-sm)

  return (
    <>
      {head}

      <body
        {...propsExceptChildren}
        color-scheme="dark"
      >
        <main
          style={{
            // minHeight: "100vh",
            // display: "grid",
            // padding: "0",
          }}
        >
          {children}
        </main>
        <div hidden>
          <ApnSym />
        </div>
      </body>
    </>
  );
}
