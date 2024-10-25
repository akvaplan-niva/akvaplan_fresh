import { WorksList } from "akvaplan_fresh/components/works_list.tsx";

export const GroupedWorks = (
  { grouped = new Map([]), limit = Infinity, groupedBy = "type", lang = "en" },
) => (
  grouped.size > 0
    ? (
      <>
        {[...grouped].map(([k, works], i) => (
          <WorksList
            group={k}
            works={works}
            groupedBy={groupedBy}
            limit={limit}
            open={i < 1 ? true : true}
            lang={lang}
          />
        ))}
      </>
    )
    : null
);
