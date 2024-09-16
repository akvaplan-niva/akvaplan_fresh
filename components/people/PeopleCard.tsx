// FIXME PeopleCard: Priors with ID should use gray symbol
// https://akvaplan.no/no/folk/name/Biuw/Martin
import { buildAkvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import { priorAkvaplanistID } from "akvaplan_fresh/services/prior_akvaplanists.ts";
import { personURL } from "akvaplan_fresh/services/nav.ts";
import { longDate } from "akvaplan_fresh/time/mod.ts";
import { Card, UseApnSym } from "akvaplan_fresh/components/mod.ts";

import {
  Icon2 as Icon,
  LinkIcon,
  TextIcon,
} from "akvaplan_fresh/components/icon_link.tsx";

import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";

import { type Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";

import { Head } from "$fresh/runtime.ts";
import { peopleURL } from "akvaplan_fresh/services/nav.ts";

interface PeopleProps {
  id?: string;
  person?: Akvaplanist;
  lang?: string;
  icons: boolean;
}
const people = globalThis?.Deno ? await buildAkvaplanistMap() : [];

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

export function PeopleCard(
  {
    person,
    lang = langSignal.value,
    id,
    icons = true,
    avatar,
  }: PeopleProps,
) {
  if (id) {
    person = people.get(id) ?? priorAkvaplanistID.get(id) ?? person;
  }

  const {
    tel,
    email,
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

  return (
    <Card>
      <div
        style={{ whiteSpace: "nowrap", fontSize: "var(--font-size-fluid-1)" }}
      >
        {name?.length > 1
          ? <span>{name}</span>
          : (
            <a href={personURL(person, lang)}>
              <span style={{ color: "var(--text1)" }}>{given}</span>
              &nbsp;
              <span style={{ color: "var(--text2)" }}>{family}</span>
            </a>
          )}
      </div>

      {isPrior(person) &&
        (
          <span style={{ fontSize: ".8rem" }}>
            {t("people.akvaplanist(prior)")}
          </span>
        )}

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

      <div title={longDate(expired ?? from ?? created, lang)}>
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
        {management === true && (
          <TextIcon icon="communities">{t("people.Management")}</TextIcon>
        )}

        {section && section !== "LEDELS" && (
          <div>
            <TextIcon icon="communities">
              <span style={{ color: "var(--text2)" }}>
                {t(`section.${section}`)}
              </span>
            </TextIcon>
          </div>
        )}
        {workplace?.length > 0 && (
          <p>
            <a
              href={`${peopleURL({ lang })}/workplace/${workplace}`}
              style={{ color: "var(--text2)" }}
            >
              <TextIcon icon="place">
                {workplace}
              </TextIcon>
            </a>
          </p>
        )}
        {icons && tel &&
          (
            <p>
              <LinkIcon href={`tel:${tel}`} icon="phone_in_talk">
                {[...tel].map((c, i) => i % 2 ? c : `${c} `)}
              </LinkIcon>
            </p>
          )}
        {icons && email && (
          <div>
            <LinkIcon href={`mailto:${email}`} icon="contact_mail">
              {email}
            </LinkIcon>
          </div>
        )}
      </div>
    </Card>
  );
}
