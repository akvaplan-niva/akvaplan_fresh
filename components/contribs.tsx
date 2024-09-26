import { personURL } from "akvaplan_fresh/services/nav.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { ApnSym } from "akvaplan_fresh/components/mod.ts";

function isString(s: unknown) {
  return typeof s === "string";
}
const nameAsString = (
  { family, given, name }: { family?: string; given?: string; name?: string },
) => family ? `${given ?? "?"} ${family}` : name;

//export const name = (name) => isString(name) ? name : nameAsString(name);

const Contrib = ({ identity, lang, ...author }) => (
  <>
    <li>
      {identity
        ? (
          <span>
            <a
              href={personURL(
                identity,
                lang,
              )}
            >
              {isString(author) ? author : nameAsString(author)}
            </a>{" "}
            <ApnSym
              width="1rem"
              height="1rem"
              style={identity?.prior === true ? { filter: "grayscale(1)" } : {}}
            />
          </span>
        )
        : <span>{isString(author) ? author : nameAsString(author)}</span>}
    </li>
  </>
);

export const AkvaplanistCounts = ({ akvaplanists }) => (
  <div>
    {akvaplanists?.current > 0 && (
      <p style={{ fontSize: "1rem" }}>
        <ApnSym width="1rem" height="1rem" /> {akvaplanists.current}{" "}
        Akvaplan-niva ({t("people.akvaplanist(now)")})
      </p>
    )}
    {akvaplanists?.prior > 0 && (
      <p style={{ fontSize: "1rem" }}>
        <ApnSym
          width="1rem"
          height="1rem"
          style="filter: grayscale(1)"
        />{" "}
        {akvaplanists.prior} Akvaplan-niva ({t("people.akvaplanist(prior)")})
      </p>
    )}
  </div>
);

export const Contributors = (
  { contributors, akvaplanists, lang },
) => (
  <ol
    style={{
      fontSize: "1rem",
      paddingInlineStart: "1rem",
    }}
  >
    {contributors?.map((c) =>
      isString(c) ? <li>{c}</li> : <Contrib {...c} lang={lang} />
    )}
  </ol>
);
