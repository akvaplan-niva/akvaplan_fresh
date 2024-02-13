import { href } from "akvaplan_fresh/search/href.ts";
import { OramaAtom } from "akvaplan_fresh/search/types.ts";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

const namesEtal = (people: string[]) => {
  if (people.length === 0) {
    return "";
  }
  if (people.length === 1) {
    return people.at(0);
  }
  if (people.length < 3) {
    return people.join(" & ");
  }
  const notShown = people.length - 2;
  return `${people.slice(0, 2).join(", ")} [+${notShown}]`;
};

export function OramaResults(
  { hits, count, list, lang }: {
    hits: OramaAtom[];
    count: number;
    list: string;
    lang: string;
  },
) {
  return (
    <div>
      <ol
        style={{
          paddingBlockEnd: "1.5rem",
          display: list === "list" ? "block" : "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        }}
      >
        {hits?.map((
          {
            score,
            document: {
              id,
              collection,
              slug,
              title,
              people,
              subtitle,
              published,
              container,
            },
          },
        ) => (
          <li
            style={{
              fontSize: "1rem",
              margin: "1px",
              padding: "0.5rem",
              background: "var(--surface0)",
            }}
          >
            <a
              title={score}
              href={href({
                id,
                slug,
                collection,
                lang,
              })}
              dangerouslySetInnerHTML={{ __html: title }}
            >
            </a>
            {["pubs"].includes(collection) && people?.length > 0
              ? <p style={{ fontSize: "0.75rem" }}>{namesEtal(people)}</p>
              : null}
            <p style={{ fontSize: "0.75rem" }}>
              <em>
                {subtitle ? subtitle : null}

                {container ? container : null}
              </em>{" "}
              {!["person"].includes(collection)
                ? `(${published.substring(0, 10)})`
                : null}
            </p>
          </li>
        ))}
      </ol>
      <aside>
        <p>
        </p>
      </aside>
    </div>
  );
}
