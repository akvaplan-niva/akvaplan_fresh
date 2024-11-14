import { t } from "akvaplan_fresh/text/mod.ts";

const SortOption = (
  {
    value,
    sort,
    selected = sort === value,
    prefix = "sort.",
    children = t(`${prefix}${value}`),
  },
) => (
  <option
    value={value}
    selected={selected}
    style={{ fontSize: ".9rem" }}
  >
    {children}
  </option>
);

const sortOptions = [
  "-published",
  "published",
  "",
  "family",
  // "-created",
  // "created",
  "-modified",
  //"modified",
];
export const SelectSort = (
  { sort, lang, options = sortOptions, ...props },
) => (
  <label lang={lang}>
    {t("sort.label")}:{"  "}
    <select style={{ fontSize: ".9rem" }} {...props}>
      {options.map((value) => <SortOption value={value} sort={sort} />)}
    </select>
  </label>
);
