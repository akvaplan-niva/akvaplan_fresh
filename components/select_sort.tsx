import { JSX } from "preact";
import { t } from "akvaplan_fresh/text/mod.ts";
export const SelectSortDefault = ({ sort, lang, ...props }) => (
  <label lang={lang}>
    {t("sort.label")}:{" "}
    <select style={{ fontSize: ".9rem" }} {...props}>
      <option
        value="-published"
        selected={sort === "-published"}
        style={{ fontSize: ".9rem" }}
      >
        {t("sort.latest")}
      </option>
      <option
        value="published"
        selected={sort === "published"}
        style={{ fontSize: ".9rem" }}
      >
        {t("sort.earliest")}
      </option>
      <option
        value=""
        selected={sort === ""}
        style={{ fontSize: ".9rem" }}
      >
        {t("sort.relevance")}
      </option>
    </select>
  </label>
);
