import { t } from "akvaplan_fresh/text/mod.ts";
import { CollectionSummary } from "akvaplan_fresh/components/CollectionSummary.tsx";
import { CristinListItem } from "akvaplan_fresh/components/cristin_list_item.tsx";

export const CristinWorksGrouped = ({ grouped, config, person, lang }) => {
  return (
    <>
      {[...grouped].map((
        [code, works],
      ) => (
        <section
          style={{ paddingBlockStart: "1rem", paddingBlockEnd: "0.5rem" }}
        >
          <CollectionSummary
            q={""}
            tprefix={"cristin."}
            collection={code}
            label={""}
            length={works?.length}
            count={works?.length}
          />

          <ol
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            }}
          >
            {works.map((work) => (
              <CristinListItem
                work={work}
                lang={lang}
              />
            ))}
          </ol>
        </section>
      ))}
    </>
  );
};
