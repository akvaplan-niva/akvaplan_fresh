import { buildContainsFilter } from "akvaplan_fresh/search/filter.ts";
import { buildYearFilter } from "akvaplan_fresh/services/dois.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import { HScroll, SlimCard } from "akvaplan_fresh/components/mod.ts";

import { type SlimPublication } from "../@interfaces/slim_publication.ts";
import { InputSearch } from "../components/search/InputSearch.tsx";

import Button from "../components/button/button.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

import { useSignal } from "@preact/signals";

export interface DoiSearchResultsProps {
  results: SlimPublication[];
  all: SlimPublication[];
  q: string;
  start?: number;
  title?: string;
  params?: Record<string, string> | URLSearchParams;
}

const lastNYears = (n: number, start = new Date().getFullYear()) =>
  [...new Array(n)].map((_, i) => start - i);

const thisYear = new Date().getFullYear();

const numYears = thisYear - (thisYear - 5);

// @todo DoiSearch calc/show num Apn people (current/prior)
export default function DoiSearch(
  { q, results, start, all, ...rest }: DoiSearchResultsProps,
) {
  const { searchParams } = globalThis?.document
    ? new URL(globalThis?.document?.URL)
    : rest.params;
  const params = new URLSearchParams(searchParams);

  const thisYear = new Date().getFullYear();
  const numYears = thisYear - (thisYear - 5);

  const query = useSignal(q);
  const filtered = useSignal(results);
  const first = useSignal(true);
  const numFound = useSignal(results.length);

  const year = useSignal(Number(params.get("year")));
  const total = all.length;

  const handleSearch = (e: Event) => {
    const { target: { value } } = e;
    query.value = value;

    const matchesQuery = all.filter(buildContainsFilter(value));
    const matchesQueryAndYear = matchesQuery.filter(
      buildYearFilter(year.value),
    );

    filtered.value = matchesQueryAndYear;
    numFound.value = matchesQueryAndYear.length;
  };

  const handleYearClick = (e: Event) => {
    const { target: { value } } = e;
    year.value = Number(value);
    const matchesQuery = all.filter(buildContainsFilter(query.value));
    const matchesYear = matchesQuery.filter(buildYearFilter(value));

    filtered.value = matchesYear;
    numFound.value = matchesYear.length;

    e.preventDefault();
  };

  // Handle search via URL query (on first load)
  if (first.value === true && q.length > 0) {
    first.value = false;
    handleSearch({ target: { value: q } });
  }

  return (
    <main style={{ background: "var(--surface1)" }}>
      <form
        id="pubs-search"
        autocomplete="off"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1rem",
          marginTop: "0.25rem",
        }}
      >
        <label for="pubs-search" style={{ fontSize: "1rem", display: "none" }}>
          {t("pubs.search.Label")}
        </label>
        <InputSearch
          type="search"
          heigth="3rem"
          name="q"
          placeholder={t("pubs.search.placeholder")}
          value={query}
          onInput={handleSearch}
        />
        <div>
          {lastNYears(numYears).map((y) => (
            <Pill
              value={y}
              selected={y === year.value}
              onClick={handleYearClick}
            >
              {y}
            </Pill>
          ))}
        </div>
      </form>
      {numFound.value === 0 && (
        <p>
          {t("pubs.search.No_pubs_matching")} "{query.value}",{" "}
          <a href="">{t("pubs.search.try_restarting_search")}</a>
        </p>
      )}

      {numFound.value > 0 && (
        <div>
          <ol>
            {filtered.value.slice(0, 200).map((slim, n) => (
              <SlimCard slim={slim} n={n} lang={lang.value} />
            ))}
          </ol>
          <p style={{ fontSize: "0.75rem" }}>{numFound}/{total}</p>
        </div>
      )}
    </main>
  );
}
// @todo Paging beyond 200 hits?
