import {
  ApnSym,
  CleanHeader,
  Footer as SiteFooter,
  LegacyStyles,
} from "./mod.ts";

import { type Breadcrumb } from "@/components/site_nav.tsx";

import { base as baseForLang, lang, t } from "@/text/mod.ts";
import { buildInitTheming } from "@/theming/mod.ts";

import { asset, Head } from "$fresh/runtime.ts";
import { FunctionComponent, JSX } from "preact";

import { type StringSignal } from "@/@interfaces/signal.ts";
import { collectionBreadcrumbs } from "@/services/mod.ts";

export type StdProps =
  & JSX.HTMLAttributes<HTMLElement>
  & {
    title?: string;
    base?: string | StringSignal;
    lang?: string | StringSignal;
    Header?: FunctionComponent;
    breadcrumbs?: Breadcrumb[];
  };

const slagord = "Fra forskning til verdiskapning";

const slogun = "From research to value creation";

export function Page(
  {
    title,
    base = baseForLang,
    href,
    collection,
    breadcrumbs,
    Logo,
    Avatar = null,
    Header = CleanHeader,
    Footer = SiteFooter,
    Left = null,
    Right = null,
    context,
    session,
    ...props
  }: StdProps,
) {
  if (!breadcrumbs && collection) {
    breadcrumbs = collectionBreadcrumbs(collection);
  }
  const head = (
    <Head>
      <title>
        {title && title + ` / `}Akvaplan-niva
      </title>

      <script
        dangerouslySetInnerHTML={{ __html: buildInitTheming() }}
      />
      <base href={base} />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="color-scheme" content="dark light" />
      <meta
        name="description"
        content={title ?? t("meta.description")}
      />

      <link
        rel="icon"
        href="/akvaplan_symbol.svg"
        type="image/svg+xml"
      />

      <LegacyStyles />

      <script defer src={asset("/@nrk/core-scroll.min.js")} />
    </Head>
  );

  const { children, ...propsExceptChildren } = props;
  // var(--size-sm)

  return (
    <>
      {head}

      <body {...propsExceptChildren}>
        <Header
          title={title}
          collection={collection}
          href={href}
          lang={lang.value}
          breadcrumbs={breadcrumbs}
          Logo={Logo}
          Avatar={Avatar}
        />

        <main
          style={{
            minHeight: "100vh",
            padding: "0 .5vw",
            _padding: "0 var(--size-3)",
          }}
        >
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
