import { doiPublicationUrl } from "akvaplan_fresh/services/nav.ts";
import { names as _names } from "./search_result_item.tsx";
import { Icon } from "akvaplan_fresh/components/icon.tsx";
interface CristinPerson {
  first_name: string;
  surname: string;
}
const cristinNames = (names: CristinPerson[], max?: number) =>
  _names(
    names.map(({ first_name, surname }) => `${first_name} ${surname}`),
    max,
  );

const _doi = (links) => links?.find(({ url_type }) => "DOI" === url_type)?.url;
const _full = (links) =>
  links?.find(({ url_type }) => "FULLTEKST" === url_type)?.url;

export const CristinWorkTitle = (
  { work, lang },
) => {
  const {
    title,
    channel,
    original_language,
    year_published,
    links,
    contributors: { preview: authors },
  } = work;

  const doi = _doi(links);
  if (doi) {
    return (
      <a href={doiPublicationUrl({ doi: _doi(links), lang })}>
        {title?.[original_language]}
      </a>
    );
  }
  const full = _full(links);
  if (full) {
    return (
      <span>
        <a href={full} target="_blank">
          {title?.[original_language]}
        </a>
        {" "}
      </span>
    );
  }
  return <p>{title?.[original_language]}</p>;
};

export const CristinListItem = (
  { work, etal = true, lang },
) => {
  const {
    title,
    channel,
    original_language,
    year_published,
    publisher,
    links,
    contributors: { preview: authors },
  } = work;
  return (
    <li
      style={{
        fontSize: "0.75rem",
        margin: "1px",
        padding: "0.5rem",
        background: "var(--surface0)",
      }}
    >
      <CristinWorkTitle work={work} lang={lang} />
      <p>{channel?.title ?? publisher?.name} ({year_published})</p>
      {authors
        ? (
          <p
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
};
