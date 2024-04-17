import { href } from "akvaplan_fresh/search/href.ts";
import type { OramaAtomSchema } from "akvaplan_fresh/search/types.ts";

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
    document: {
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
    },
    etal,
  },
) => (
  <li
    title={score}
    style={{
      fontSize: "1rem",
      margin: "1px",
      padding: "0.5rem",
      background: "var(--surface0)",
    }}
  >
    <div>
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
        {cloudinary && ["image", "pubs", "video"].includes(collection)
          ? (
            <img
              width="148"
              height="148"
              alt={title}
              src={`https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_148,h_148,q_auto:good/${cloudinary}`}
            />
          )
          : null}
        <p
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </a>
    </div>
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
        ? `(${published.substring(0, 10)})`
        : `(${published.substring(0, 7)})`}
    </p>
  </li>
);
