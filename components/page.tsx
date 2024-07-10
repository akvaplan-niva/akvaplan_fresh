import { ApnSym, CleanHeader, Footer as SiteFooter, Styles } from "./mod.ts";

import { type Breadcrumb } from "akvaplan_fresh/components/site_nav.tsx";

import { base as baseForLang, lang, t } from "akvaplan_fresh/text/mod.ts";
import { buildInitTheming } from "akvaplan_fresh/theming/mod.ts";

import { asset, Head } from "$fresh/runtime.ts";
import { FunctionComponent, JSX } from "preact";

//import { computed } from "@preact/signals-core";
import { type StringSignal } from "akvaplan_fresh/@interfaces/signal.ts";
import { collectionBreadcrumbs } from "akvaplan_fresh/services/mod.ts";
import { SocialMediaIcons } from "akvaplan_fresh/components/social_media_icons.tsx";
import { Section } from "./section.tsx";
import { Icon2, LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";
//import { symbolDataURI } from "akvaplan_fresh/components/akvaplan/symbol.tsx";

export type StdProps =
  & JSX.HTMLAttributes<HTMLElement>
  & {
    title?: string;
    base?: string | StringSignal;
    lang?: string | StringSignal;
    Header?: FunctionComponent;
    breadcrumbs: Breadcrumb[];
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

      <Styles />
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
            padding: "0 2vw",
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
