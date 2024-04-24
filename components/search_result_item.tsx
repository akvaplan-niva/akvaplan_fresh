import { href } from "akvaplan_fresh/search/href.ts";
import { lang as langSignal } from "akvaplan_fresh/text/mod.ts";
import { MiniCard } from "akvaplan_fresh/components/card.tsx";
import type { OramaAtomSchema } from "akvaplan_fresh/search/types.ts";
import { t } from "../text/mod.ts";

export const names = (people: string[], max?: number) => {
  if (people.length === 0) {
    return "";
  }
  if (people.length === 1) {
    return people.at(0);
  }
  if (people.length < 3) {
    return people.join(" & ");
  }
  if (max && max >= 2) {
    const notShown = people.length - max;
    return `${people.slice(0, max).join(", ")} [+${notShown}]`;
  }
  return people.join(", ");
};
export const SearchResultItem = (
  {
    score,
    document,
    etal,
  },
) => {
  const {
    id,
    slug,
    collection,
    lang,
    title,
    subtitle,
    container,
    published,
    authors,
    cloudinary,
  } = document;

  return (
    <li
      title={score}
      style={{
        fontSize: "0.75rem",
        margin: "1px",
        //padding: "0.5rem",
        background: "var(--surface0)",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: ".5rem",
          padding: ".25rem",
          gridTemplateColumns: cloudinary ? "1fr 4fr" : "0 1fr",
        }}
      >
        {cloudinary
          ? (
            <a
              style={{ placeContent: "center" }}
              href={href({
                id,
                slug,
                collection,
                lang,
                title,
                authors,
                etal,
              })}
            >
              <img
                width="148"
                height="148"
                alt={title}
                src={`https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_148,h_148,q_auto:good/${cloudinary}`}
              />
            </a>
          )
          : <a></a>}
        <MiniCard style={{ placeContent: "center" }}>
          <a
            href={href({
              id,
              slug,
              collection,
              lang,
              title,
              authors,
              etal,
            })}
          >
            <p
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </a>
          {authors?.length > 0
            ? (
              <p
                style={{ fontSize: "0.75rem" }}
                title={names(authors)}
                onClick={() => etal.value = false === etal.value ? true : false}
              >
                {etal?.value === true ? names(authors, 2) : names(authors)}
              </p>
            )
            : null}
          <p style={{ fontSize: "0.75rem" }}>
            <em>
              {subtitle ? subtitle : null}

              {container ? container : null}
            </em>{" "}
            {!["person"].includes(collection)
              ? `${published.substring(0, 10)}`
              : `${published.substring(0, 7)}`}
            {!["image", "person"].includes(collection) && lang &&
                lang !== langSignal.value
              ? ` (${t(`lang.${lang}`)}) `
              : null}
          </p>
        </MiniCard>
      </div>
    </li>
  );
};
