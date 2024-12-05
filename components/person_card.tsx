import { getAkvaplanist } from "akvaplan_fresh/services/akvaplanist.ts";
import { personURL } from "akvaplan_fresh/services/nav.ts";
import { longDate } from "../time/intl.ts";

import { LinkIcon, TextIcon } from "akvaplan_fresh/components/icon_link.tsx";

import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";

import { type Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";
import { peopleURL } from "akvaplan_fresh/services/nav.ts";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { UseApnSym } from "akvaplan_fresh/components/akvaplan/symbol.tsx";

interface PeopleProps {
  id?: string;
  person?: Akvaplanist;
  lang?: string;
  icons: boolean;
}

const isExpired = ({ expired } = {}) => {
  if (!expired) {
    return false;
  }
  return new Date() >= new Date(expired) ? true : false;
};

const isPrior = ({ expired, prior } = {}) => {
  if (prior === true) {
    return true;
  }
  return isExpired({ expired });
};

export const AkvaplanistCardBasic = (
  { id, name, family, given, from, expired, prior, lang }:
    & Pick<
      Akvaplanist,
      | "id"
      | "name"
      | "family"
      | "given"
      | "prior"
      | "expired"
    >
    & { lang: string },
) => (
  <a href={personURL({ id, name, given, family }, lang)}>
    <Card>
      <h1
        style={{ fontSize: "var(--font-size-fluid-1)", color: "var(--text1)" }}
      >
        {name ? name : (
          <>
            <span>{given}</span>{" "}
            <span style={{ color: "var(--text2)" }}>{family}</span>
          </>
        )}
      </h1>
      {isPrior({ expired, prior }) &&
        (
          <p style={{ fontSize: ".8rem" }}>
            <em>{t("people.akvaplanist(prior)")}</em>
          </p>
        )}

      <UseApnSym
        width="2rem"
        height="2rem"
        style={isPrior({ expired, prior }) ? { filter: "grayscale(1)" } : {}}
      />
    </Card>
  </a>
);

// FIXME PeopleCard: Priors with ID should use gray symbol
// https://akvaplan.no/no/folk/name/Biuw/Martin
// The above URL is no longer used, but may be in the wild, new URL:
// https://akvaplan.no/~01hs99np0hmbybezqs5jy5w5m3/martin+biuw

export function PersonCard(
  {
    person,
    href,
    lang = langSignal.value,
    id,
    icons = true,
    avatar,
  }: PeopleProps,
) {
  if (id && !person) {
    person = getAkvaplanist(id);
  }

  const {
    tel,
    name,
    given,
    family,
    position,
    section,
    workplace,
    management,
    responsibility,
    prior,
    expired,
    published,
    created,
    from,
  } = person ?? {};

  const email = [false, null, undefined].includes(prior) && person &&
      person?.id?.length === 3
    ? person.id + "@akvaplan.niva.no"
    : person?.email;

  return (
    <Card>
      <div
        style={{ whiteSpace: "nowrap", fontSize: "var(--font-size-fluid-1)" }}
      >
        {name?.length > 1
          ? <span>{name}</span>
          : (
            <a href={href ?? personURL(person, lang)}>
              <span style={{ color: "var(--text1)" }}>{given}</span>
              &nbsp;
              <span style={{ color: "var(--text2)" }}>{family}</span>
            </a>
          )}
        {isPrior(person) &&
          (
            <p>
              <em style="font-size: .9rem;">
                {t("people.akvaplanist(prior)")}
              </em>
            </p>
          )}
      </div>

      <span style="font-size: .9rem;
  font-weight: 500;
  color: var(--accent);">
        {position?.[lang]}
      </span>
      {responsibility?.[lang] && (
        <span style="font-size: .9rem">
          {" "}
          {responsibility?.[lang]}
        </span>
      )}

      <div>
        {avatar
          ? (
            <img
              src={avatar}
              width="44"
              height="44"
              style={{ borderRadius: "22px" }}
            />
          )
          : (
            <UseApnSym
              width="2rem"
              height="2rem"
              style={isPrior(person) ? { filter: "grayscale(1)" } : {}}
            />
          )}
      </div>

      <div
        style={{
          marginTop: "1rem",
          fontSize: ".9rem",
        }}
      >
        {icons && email && (
          <div>
            <LinkIcon href={`mailto:${email}`} icon="alternate_email">
              {email}
            </LinkIcon>
          </div>
        )}
        {icons && tel &&
          (
            <p>
              <LinkIcon href={`tel:${tel}`} icon="phone_in_talk">
                {[...tel].map((c, i) => i % 2 ? c : `${c} `)}
              </LinkIcon>
            </p>
          )}
        {management === true && (
          <TextIcon icon="communities">{t("people.Management")}</TextIcon>
        )}

        {section && section !== "LEDELS" && (
          <div>
            <LinkIcon
              icon="communities"
              href={`${peopleURL({ lang })}/?q=${
                section?.toLocaleLowerCase("no")
              }`}
            >
              {t(`section.${section}`)}
            </LinkIcon>
          </div>
        )}
        {workplace?.length > 0 && (
          <p>
            <a
              href={`${peopleURL({ lang })}/workplace/${
                workplace?.toLocaleLowerCase("no")
              }`}
              style={{ color: "var(--text2)" }}
            >
              <TextIcon icon="place">
                {workplace}
              </TextIcon>
            </a>
          </p>
        )}
        {icons && from &&
          (
            <time>
              <TextIcon icon="update">
                {longDate(from, lang)}
              </TextIcon>
            </time>
          )}

        {icons && expired &&
          (
            <time>
              <TextIcon icon="history">
                {longDate(expired, lang)}
              </TextIcon>
            </time>
          )}
      </div>
    </Card>
  );
}
