import { Breadcrumbs, Page } from "akvaplan_fresh/components/mod.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { MarkdownPanel } from "akvaplan_fresh/components/markdown.tsx";

import { asset, Head } from "$fresh/runtime.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { Naked } from "@/components/naked.tsx";
import { ImgHero } from "@/components/hero/hero.tsx";
import { cloudinary0, peopleURL } from "@/services/mod.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { t } from "@/text/mod.ts";
import { serviceHref } from "@/services/nav.ts";
export const PanelPage = (
  { base, collection, panel, lang, editor, contacts, url, more, search },
) => (
  <Naked base={base} title={panel.title} collection={collection}>
    <HeaderLogoStickyNav lang={lang} />

    <MarkdownPanel
      panel={panel}
      lang={lang}
      breadcrumbs={[{ href: serviceHref(), text: t("nav.Services") }]}
    />

    <Section>
      {panel?.search === true && (
        <GroupedSearch
          term={[panel.intl.en.title, panel.intl.no.title].map((
            s,
          ) => s?.replace("–", " ")).join(
            " ",
          )}
          origin={url}
          threshold={.75}
          limit={4}
          noInput
          {...search}
        />
      )}
    </Section>
  </Naked>
);
