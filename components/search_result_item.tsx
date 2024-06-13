import { href as _href } from "akvaplan_fresh/search/href.ts";
import { lang as langSignal } from "akvaplan_fresh/text/mod.ts";
import { MiniCard } from "akvaplan_fresh/components/card.tsx";
import type { OramaAtomSchema } from "akvaplan_fresh/search/types.ts";
import { t } from "../text/mod.ts";
import { slug as slugify } from "slug";

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
    href,
    collection,
    title,
    subtitle,
    container,
    published,
    authors,
    cloudinary,
    img512,
    thumb,
    intl,
  } = document;
  const lang = langSignal.value;
  const hreflang = document?.lang ?? lang;

  const name = intl && intl.name && intl.name[lang] ? intl.name[lang] : title;

  const _slug = intl && intl.slug && intl.slug[lang]
    ? intl.slug[lang]
    : document.slug;

  const slug = _slug ? _slug : `${slugify(name)}/${id}`;

  const _img = cloudinary
    ? `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_148,h_148,q_auto:good/${cloudinary}`
    : undefined;

  const img = _img ?? img512 ?? document.img;

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
          gridTemplateColumns: (cloudinary || img) ? "1fr 4fr" : "0 1fr",
        }}
      >
        {img
          ? (
            <a
              style={{ placeContent: "center" }}
              href={href ?? _href({
                id,
                slug,
                collection,
                hreflang,
                title,
                authors,
                etal,
              })}
            >
              <img
                width="148"
                height="148"
                alt={name}
                src={img}
              />
            </a>
          )
          : <a></a>}

        <MiniCard style={{ placeContent: "center" }}>
          <a
            href={href ?? _href({
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
              dangerouslySetInnerHTML={{ __html: name }}
            />
            {"person" === collection && (
              <svg class="icon" width="1rem" height="1rem">
                <use href="#akvaplan_symbol"></use>
              </svg>
            )}
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
            {published
              ? !["person"].includes(collection)
                ? `${published.substring(0, 10)}`
                : `${published.substring(0, 7)}`
              : null}

            {!["image", "person"].includes(collection) && hreflang &&
                hreflang !== lang
              ? ` (${t(`lang.${hreflang}`)}) `
              : null}
          </p>
        </MiniCard>
      </div>
    </li>
  );
};
