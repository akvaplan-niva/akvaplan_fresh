import { WorksList } from "akvaplan_fresh/components/works_list.tsx";
import { computed, useSignal } from "@preact/signals";
import { SelectYear } from "akvaplan_fresh/components/select_year.tsx";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import type { JSX } from "preact/jsx-runtime";

export const GroupedWorks = (
  {
    works,
    limit = Infinity,
    groupedBy = "type",
    lang,
    year,
    years = [],
  },
) => {
  langSignal.value = lang;
  year = useSignal(year);

  const setYear = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    e.preventDefault();
    const [option0] = e.currentTarget.selectedOptions;
    const selectedYear = option0.value?.length > 0
      ? Number(option0.value)
      : undefined;
    year.value = selectedYear;
  };

  const filteredWorks = computed(() => {
    return year && year.value > 1900
      ? works.filter((w) => Number(w.year) === Number(year)) ?? []
      : works ?? [];
  });

  const grouped = computed(
    () => [
      ...Map.groupBy<string | number, Pub[]>(
        filteredWorks.value,
        (w) => w[groupedBy],
      ),
    ],
  );

  return (works.length < 1 ? null : (
    <form>
      <h2>
        {t("nav.Pubs")}{" "}
        <button class="custom-button pill" disabled>
          {filteredWorks.value.length}
        </button>
      </h2>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          padding: "1rem 0",
          gridTemplateColumns: "auto 1fr",
        }}
      >
        <label>
          {t("search.Year")}:{" "}
          <SelectYear
            year={year}
            years={years}
            onChangeCapture={setYear}
            style={{ fontSize: ".8rem" }}
          />
        </label>
      </div>

      {grouped.value.map(([k, works], i) => (
        <WorksList
          group={k}
          works={works}
          groupedBy={groupedBy}
          limit={limit}
          open={i < 1 ? true : true}
          lang={lang}
        />
      ))}
    </form>
  ));
};
