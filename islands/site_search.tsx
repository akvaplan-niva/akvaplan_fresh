import { lang as siteLangSignal, t } from "akvaplan_fresh/text/mod.ts";
import { InputSearch } from "akvaplan_fresh/components/search/InputSearch.tsx";
import { useSignal } from "@preact/signals";
import { href } from "../search/href.ts";
import { SearchAtom } from "akvaplan_fresh/search/types.ts";

const search = async ({ q, base }) => {
  const url = new URL("/api/search", base);
  const { searchParams } = url;
  searchParams.set("q", q);
  searchParams.set("group-by", "collection");
  const r = await fetch(url);
  if (r.ok) {
    return await r.json();
  }
};

const CollectionSummary = ({ q, collection, length, count }) => (
  <summary>
    {t(`collection.${collection}`)} ({count > length
      ? (
        <span>
          {t("ui.see_all")}{"  "}
          <a href={`_?q=${q}&collection=${collection}`}>
            {count}
          </a>
        </span>
      )
      : <span>{length}</span>})
  </summary>
);

// {t("collection." + values?.[0])} (
//   { facetCountCollection(values?.[0]) > result.length ?
// > : <span>x</span>)

export default function SiteSearch(
  { term }: { term?: string; lang?: string },
) {
  const query = useSignal(term);
  const groups = useSignal([]);
  // const action = `/${lang}/_`;
  const facets = useSignal(new Map());
  const sitelang = siteLangSignal.value;

  const performSearch = async ({ q, base }) => {
    query.value = q;
    const result = await search({ q, base });
    groups.value = q?.length > 0 ? result.groups : [];
    for (
      const [collection, count] of Object.entries(
        result?.facets?.collection?.values,
      )
    ) {
      facets.value.set(collection, count);
    }
  };

  const handleUserSearchInput = async (e: Event) => {
    e?.preventDefault();
    const { target: { value, ownerDocument } } = e;
    const { origin } = new URL(ownerDocument.URL);
    performSearch({ q: value, base: origin });
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
          type="search"
          heigth="3rem"
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
          <details open style={{ paddingBlockStart: "0.5rem" }}>
            <CollectionSummary
              q={query.value}
              collection={values?.[0]}
              length={result.length}
              count={facetCountCollection(values?.[0])}
            />

            <ol
              style={{ paddingBlockEnd: "1.5rem" }}
            >
              {result?.map((
                { document: { id, collection, slug, title, lang } }: {
                  document: SearchAtom;
                },
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
                      lang: sitelang,
                      hreflang: lang,
                    })}
                    dangerouslySetInnerHTML={{ __html: title }}
                  >
                  </a>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </output>
    </main>
  );
}
