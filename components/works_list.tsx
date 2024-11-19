import {
  atomizeSlimPublication,
  nameFromAuthor,
} from "akvaplan_fresh/search/indexers/pubs.ts";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";
import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";
import type { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
export const WorksList = (
  { group, groupedBy, summary, open, works, limit, lang }: {
    works: SlimPublication[];
    lang: string;
  },
) => {
  const worksWithAuthorNames = works.map((w) => {
    // console.warn({ atom });
    // w.name = "name";
    // w.slug = "avc/def";
    w.name = new URL(w.id).pathname.slice(1);
    w.intl = { href: { en: "EN", no: "NO" } };
    w.collection = "pubs";
    return w;
  });
  const hits = worksWithAuthorNames.map((document) => ({ document })).slice(
    0,
    limit,
  );

  return (
    <details
      open={open}
      style={{ paddingBlockStart: "0.5rem" }}
    >
      <summary>
        {summary ? summary : t(`${groupedBy}.${group}`)}

        <Pill>
          {works.length}
        </Pill>
      </summary>

      <SearchResults hits={hits} lang={lang} />
    </details>
  );
};
