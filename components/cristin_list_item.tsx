import { names as _names } from "./search_result_item.tsx";
interface CristinPerson {
  first_name: string;
  surname: string;
}
const cristinNames = (names: CristinPerson[], max?: number) =>
  _names(
    names.map(({ first_name, surname }) => `${first_name} ${surname}`),
    max,
  );

export const CristinListItem = (
  {
    title,
    channel,
    original_language,
    year_published,
    contributors: { preview: authors },
  },
  { etal = true },
) => (
  <li
    style={{
      fontSize: "1rem",
      margin: "1px",
      padding: "0.5rem",
      background: "var(--surface0)",
    }}
  >
    <p>{title?.[original_language]}</p>
    <p>{channel?.title} ({year_published})</p>
    {authors
      ? (
        <p
          style={{ fontSize: "0.75rem" }}
          title={cristinNames(authors)}
        >
          {etal === true || etal?.value === true
            ? cristinNames(authors, 2)
            : cristinNames(authors)}
        </p>
      )
      : null}
  </li>
);
