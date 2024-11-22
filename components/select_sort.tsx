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
    style={{ fontSize: "1rem" }}
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
  { sort, options = sortOptions, ...props },
) => (
  <select {...props}>
    {options.map((value) => <SortOption value={value} sort={sort} />)}
  </select>
);
