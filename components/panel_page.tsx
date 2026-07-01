import { Section } from "@/components/section.tsx";
import { MarkdownPanel } from "@/components/markdown.tsx";

import GroupedSearch from "@/islands/grouped_search.tsx";
import { Naked } from "@/components/naked.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { t } from "@/text/mod.ts";
import { serviceHref } from "@/services/nav.ts";
export const PanelPage = (
  {
    eyebrow,
    base,
    collection,
    panel,
    lang,
    editor,
    contacts,
    url,
    more,
    search,
  },
) => (
  <Naked base={base} title={panel.title} collection={collection}>
    <HeaderLogoStickyNav lang={lang} />

    <MarkdownPanel
      eyebrow={eyebrow}
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
