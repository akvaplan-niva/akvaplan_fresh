import { CollectionSummary } from "akvaplan_fresh/components/CollectionSummary.tsx";
import { CristinList } from "./cristin_list.tsx";

export const groupByCategory = ({ category: { code } }) => code;
export const CristinWorksGrouped = ({ grouped, lang }) => {
  return (
    <>
      {[...grouped].map((
        [code, works],
      ) => (
        <section
          style={{ paddingBlockStart: "1rem", paddingBlockEnd: "0.5rem" }}
        >
          <CollectionSummary
            tprefix={"cristin."}
            collection={code}
            label={""}
            length={works?.length}
            count={works?.length}
          />

          <CristinList works={works} lang={lang} />
        </section>
      ))}
    </>
  );
};
