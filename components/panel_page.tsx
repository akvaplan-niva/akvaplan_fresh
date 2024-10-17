import {
  ArticleSquare,
  Card,
  HScroll,
  Page,
  PersonCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { Markdown } from "akvaplan_fresh/components/markdown.tsx";
import { ImagePanel, WideCard } from "akvaplan_fresh/components/panel.tsx";

import { asset, Head } from "$fresh/runtime.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { panelHref } from "akvaplan_fresh/services/panelHref.tsx";
export const PanelPage = (
  { base, collection, panel, lang, editor, contacts, url, more, search },
) => (
  <Page base={base} title={panel.title} collection={collection}>
    <Section style={{ display: "grid", placeItems: "center" }}>
      {panel?.image?.cloudinary?.length > 0
        ? (
          <ImagePanel
            {...{ ...panel, intro: "" }}
            lang={lang}
            editor={editor}
            maxHeight={"86vh"}
          />
        )
        : (
          <header>
            <h1>{panel.title}</h1>
            {panel?.image?.url && <img src={panel.image.url} />}
          </header>
        )}
      {panel?.intro && (
        <Card>
          <p id="intro">
            <Markdown
              text={panel.intro}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </p>
        </Card>
      )}
    </Section>

    <Section style={{ display: "grid", placeItems: "center" }}>
      <Card>
        <p>
          {panel?.desc && (
            <Markdown
              text={panel.desc}
              style={{ whiteSpace: "pre-wrap", fontSize: "1rem" }}
            />
          )}
        </p>
      </Card>
    </Section>

    <Section style={{ display: "grid", placeItems: "center" }}>
      <HScroll maxVisibleChildren={3}>
        {more?.map(({ id, collection, title, image }) => (
          <ArticleSquare
            title={title}
            img={`https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_512,ar_1:1/${image.cloudinary}`}
            published={""}
            href={panelHref({ id, collection, title }, { lang })}
            width="320"
            height="320"
            maxWidth="320px"
          />
        ))}
      </HScroll>
    </Section>

    <Section>
      <div style="display: grid; gap: 0.75rem; padding: .5rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)">
        {contacts.map((id) => <PersonCard id={id} icons={false} />)}
      </div>
    </Section>

    <Section>
      {search && (
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

    <Head>
      <link rel="stylesheet" href={asset("/css/bento.css")} />
    </Head>
  </Page>
);
