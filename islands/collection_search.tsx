import { searchViaApi } from "akvaplan_fresh/search/search.ts";

import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import { InputSearch } from "../components/search/InputSearch.tsx";

import type { SearchAtom } from "akvaplan_fresh/search/types.ts";
import type { Result, Results } from "@orama/orama";

import { useSignal } from "@preact/signals";
import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";
import { CollectionSummary } from "../components/CollectionSummary.tsx";
// import { yearFacet } from "akvaplan_fresh/search/search.ts";
// import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

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

const highestCountFirst = (a, b) => b[1] - a[1];

const facetMapper = (facets, { limit = -1, sort = highestCountFirst } = {}) =>
  Object.entries(facets ?? {}).flatMap((
    [facet, { values }],
  ) => ({
    facet,
    groups: Object.entries(values)
      .sort(highestCountFirst)
      .slice(0, limit)
      .map(([label, count]) => ({
        label: label.split("-").join("–"),
        count,
        from: Number(label.split("-").at(0)),
        to: Number(label.split("-").at(-1)),
      })),
  }));

export default function CollectionSearch(
  { q, lang, collection, placeholder, facets, results, list }: {
    q?: string;
    lang?: string;
    collection: string;
    placeholder?: string;
    results: Results<SearchAtom>;
  },
) {
  const where = { collection };
  const query = useSignal(q);
  const limit = useSignal(5);

  const hits = useSignal((results?.hits ?? []) as Result<SearchAtom>[]);
  const count = useSignal(results?.count ?? 0);
  const facet = useSignal(facetMapper(results?.facets));

  const performSearch = async (
    { q, ...params }: { q: string },
  ) => {
    query.value = q;

    const results = await searchViaApi({
      q,
      facets,
      ...params,
      where,
      groupBy: false,
    });
    if (results) {
      hits.value = results.hits;
      count.value = results.count;
      facet.value = facetMapper(results?.facets);
    }
  };

  const handleSearchInput = async (e: Event) => {
    console.warn(e);
    const { target: { value, ownerDocument } } = e;
    const { origin } = new URL(ownerDocument?.URL ?? document?.URL);
    performSearch({ q: value, base: origin, limit: limit.value });
    e.preventDefault();
  };

  return (
    <main>
      <form
        id="site-search"
        action={``}
        autocomplete="off"
        style={list === "list" ? {} : {
          // display: "grid",
          // gridTemplateColumns: "1fr",
          // gap: "1rem",
          // marginTop: "0.25rem",
        }}
      >
        <InputSearch
          autofocus
          name="q"
          placeholder={placeholder}
          label="Søk i Akvaplan-niva (folk, tjenester, forskningstema, prosjekter, nyheter, publikasjoner, dokumenter, media)"
          value={query}
          autocomplete="off"
          onInput={handleSearchInput}
        />

        <label style={{ fontSize: "1rem", display: "none" }}></label>
      </form>
      <output>
        <div
          style={{
            paddingBlockStart: "1rem",
          }}
        >
          <CollectionSummary
            q={query.value}
            collection={collection}
            length={hits.value.length}
            lang={lang}
            count={count.value}
          />
          <SearchResults
            hits={hits.value}
            count={count.value}
            lang={lang}
            list={list}
          />
        </div>
        {
          /* <div>
          {facet.value.filter((f) => f.facet !== "collection").map((f) => (
            <>
              <dt>{f.facet}</dt>
              <dd>
                {f.groups.slice(0, 100).map(({ label, count }) => (
                  <span>
                    <a>{label}</a> {count > 1 ? <Pill>{count}</Pill> : null}
                  </span>
                ))}
              </dd>
            </>
          ))}
        </div> */
        }
      </output>
    </main>
  );
}
