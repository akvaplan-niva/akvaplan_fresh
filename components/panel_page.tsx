import {
  ArticleSquare,
  Card,
  HScroll,
  Page,
  PersonCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import {
  Markdown,
  MarkdownPanel,
} from "akvaplan_fresh/components/markdown.tsx";
import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";

import { asset, Head } from "$fresh/runtime.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { panelHref } from "akvaplan_fresh/services/panelHref.tsx";
import { Breadcrumbs } from "akvaplan_fresh/components/site_nav.tsx";
import { breadcrumb } from "akvaplan_fresh/services/mod.ts";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";
export const PanelPage = (
  { base, collection, panel, lang, editor, contacts, url, more, search },
) => (
  <Page base={base} title={panel.title} collection={collection}>
    {
      /* <Breadcrumbs
      list={[breadcrumb(collection, lang)]}
    /> */
    }
    <MarkdownPanel panel={panel} lang={lang} />

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

    {/* FIXME add children */}
    <Head>
      <link rel="stylesheet" href={asset("/css/bento.css")} />
    </Head>
  </Page>
);
