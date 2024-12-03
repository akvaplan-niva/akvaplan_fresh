import { t } from "akvaplan_fresh/text/mod.ts";

export const SelectYear = ({ year, years, ...props }) => (
  <select {...props}>
    {years.map((y) => (
      <option selected={Number(year) === y} value={y}>
        {y === null ? t("search.all") : y}
      </option>
    ))}
  </select>
);
