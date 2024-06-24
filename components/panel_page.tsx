import {
  Card,
  HScroll,
  Page,
  PeopleCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { Markdown } from "akvaplan_fresh/components/markdown.tsx";
import { ImagePanel, WideCard } from "akvaplan_fresh/components/panel.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";

import { asset, Head } from "$fresh/runtime.ts";
export const PanelPage = (
  { base, collection, panel, lang, editor, contacts, url, more },
) => (
  <Page base={base} title={panel.title} collection={collection}>
    <Section style={{ display: "grid", placeItems: "center" }}>
      {panel?.image?.cloudinary
        ? (
          <ImagePanel
            {...{ ...panel, intro: "" }}
            lang={lang}
            editor={editor}
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

    <Section>
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

      <HScroll maxVisibleChildren={3}>
        {more?.map((props) => (
          <WideCard
            {...props}
            sizes="30vw"
          />
        ))}
      </HScroll>
    </Section>

    <Section>
      <div style="display: grid; gap: 0.75rem; padding: .5rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)">
        {contacts.map((id) => <PersonCard id={id} icons={false} />)}
      </div>
    </Section>

    {
      /* <Section>
      <GroupedSearch
        term={panel.title?.replace("–", " ")}
        exclude={["person", "image", "document", "blog", "pubs"]}
        origin={url}
        threshold={0.5}
        limit={3}
        noInput
      />
    </Section> */
    }

    <Head>
      <link rel="stylesheet" href={asset("/css/bento.css")} />
    </Head>
  </Page>
);
