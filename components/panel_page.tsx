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
    searchfor,
  },
) => {
  const phrases = searchfor ?? [panel.intl.en.title, panel.intl.no.title];
  const term = JSON.stringify(phrases).replace(/[\[\]]/g, "");

  return (
    <Naked
      base={base}
      title={panel.title}
      collection={collection}
    >
      <HeaderLogoStickyNav url={url} lang={lang} />

      <MarkdownPanel
        eyebrow={eyebrow}
        panel={panel}
        lang={lang}
        breadcrumbs={[{ href: serviceHref(), text: t("nav.Services") }]}
      />

      <Section>
        {false && (
          <GroupedSearch
            term={term}
            origin={url}
            threshold={.075}
            limit={4}
            display="block"
            {
              //noInput
              ...search
            }
          />
        )}
      </Section>
    </Naked>
  );
};
