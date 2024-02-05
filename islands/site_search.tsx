import { searchViaApi } from "akvaplan_fresh/search/search.ts";

import { lang as siteLangSignal, t } from "akvaplan_fresh/text/mod.ts";
import { href } from "akvaplan_fresh/search/href.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import { InputSearch } from "akvaplan_fresh/components/search/InputSearch.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

import type { SearchAtom } from "akvaplan_fresh/search/types.ts";
import type { GroupByParams, Orama, Results, SearchParams } from "@orama/orama";

import { useSignal } from "@preact/signals";

const detailsOpen = (collection: string) =>
  ["image", "document", "video", "blog", "pubs"].includes(collection)
    ? false
    : true;

const collectionHref = ({ collection, lang }) => {
  if (!intlRouteMap(lang).has(collection)) {
    console.error("Missing collectionHref", collection, lang);
  }
  return intlRouteMap(lang).get(collection);
};

const CollectionSummary = (
  { q, collection, length, count, lang, handlePressed }: {
    q: string;
    collection: string;
    length: number;
    count: number;
    number: number;
    lang: string;
  },
) => (
  <summary>
    {t(`collection.${collection}`)}

    <Pill
      data-collection={collection}
      onClick={handlePressed}
    >
      {count}
    </Pill>
  </summary>
);

export default function SiteSearch(
  { term, lang }: { term?: string; lang?: string },
) {
  const query = useSignal(term);
  const limit = useSignal(5);
  const groups = useSignal([]);
  const facets = useSignal(new Map());
  const sitelang = siteLangSignal.value;

  const performSearch = async (
    { q, ...params }: { q: string },
  ) => {
    query.value = q;
    const results = await searchViaApi({ q, ...params });
    if (results) {
      groups.value = q?.length > 0 ? results.groups : [];
      for (
        const [collection, count] of Object.entries(
          results?.facets?.collection?.values,
        )
      ) {
        facets.value.set(collection, count);
      }
    }
  };

  const handleUserSearchInput = async (e: Event) => {
    e?.preventDefault();
    const { target: { value, ownerDocument } } = e;
    const { origin } = new URL(ownerDocument.URL);
    performSearch({ q: value, base: origin, limit: limit.value });
  };

  const handleCollectionPressed = async (e: Event) => {
    e?.preventDefault();

    const {
      target,
    } = e;
    const { selected, value, ownerDocument, dataset: { collection, action } } =
      target;
    const { origin } = new URL(ownerDocument.URL);
    limit.value += 20;
    const q = query.value;
    const where = { collection };
    performSearch({ q, base: origin, limit: limit.value, where });
  };

  // Handle search via URL query (on first load)
  // if (first.value === true && q.length > 0) {
  //   first.value = false;
  //   handleSearch({ target: { value: q } });
  // }

  const facetCountCollection = (collection: string) =>
    facets.value.get(collection) ?? "?";

  return (
    <main>
      <form
        id="site-search"
        action={`/${lang}/_`}
        autocomplete="off"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1rem",
          marginTop: "0.25rem",
        }}
      >
        <InputSearch
          autofocus
          name="q"
          placeholder={t("ui.search.site.Search")}
          label="Søk i Akvaplan-niva (folk, tjenester, forskningstema, prosjekter, nyheter, publikasjoner, dokumenter, media)"
          value={query}
          autocomplete="off"
          onInput={handleUserSearchInput}
        />

        <label style={{ fontSize: "1rem", display: "none" }}></label>
      </form>
      <output>
        {groups.value?.map(({ values, result }) => (
          <details
            open={detailsOpen(values?.[0])}
            style={{ paddingBlockStart: "0.5rem" }}
          >
            <CollectionSummary
              q={query.value}
              collection={values?.[0]}
              length={result.length}
              lang={lang}
              handlePressed={handleCollectionPressed}
              count={facetCountCollection(values?.[0])}
            />

            <ol
              style={{ paddingBlockEnd: "1.5rem" }}
            >
              {result?.map((
                { document: { id, collection, slug, title, published } },
              ) => (
                <li
                  style={{
                    fontSize: "1rem",
                    margin: "1px",
                    padding: "0.5rem",
                    background: "var(--surface0)",
                  }}
                >
                  <a
                    href={href({
                      id,
                      slug,
                      collection,
                      lang,
                    })}
                    dangerouslySetInnerHTML={{ __html: title }}
                  >
                  </a>
                  <p style={{ fontSize: "0.75rem" }}>
                    <em>{published.substring(0, 4)}</em>
                  </p>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </output>
    </main>
  );
}
