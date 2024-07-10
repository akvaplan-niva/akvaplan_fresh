// FIXME PeopleCard: Priors with ID should use gray symbol
// https://akvaplan.no/no/folk/name/Biuw/Martin
import { buildAkvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import { priorAkvaplanistID } from "akvaplan_fresh/services/prior_akvaplanists.ts";
import { personURL } from "akvaplan_fresh/services/nav.ts";

import { Card, UseApnSym } from "akvaplan_fresh/components/mod.ts";

import {
  Icon2 as Icon,
  LinkIcon,
  TextIcon,
} from "akvaplan_fresh/components/icon_link.tsx";

import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";

import { type Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";

import { Head } from "$fresh/runtime.ts";

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
  } = person ?? {};

  return (
    <Card customClass="people-card">
      <Head>
        {/* <link rel="stylesheet" href="/css/people-card.css" /> */}
      </Head>

      <div class="people-name" style={{ whiteSpace: "nowrap" }}>
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

      <span>
        <span style="font-size: 1rem;
  font-weight: 500;
  margin-top: 0.5rem;
  color: var(--accent);">
          {position?.[lang]}
          {responsibility?.[lang] && (
            <span>
              <br />
              {responsibility?.[lang]}
            </span>
          )}
        </span>

        <div class="people-workplace">
          {management === true && (
            <span>
              {t("people.Management")}
            </span>
          )}
        </div>

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
            fontSize: "1rem",
          }}
        >
          {section && section !== "LEDELS" && (
            <div>
              <TextIcon href={``} icon="communities">
                <span style={{ color: "var(--text2)" }}>
                  {t(`section.${section}`)}
                </span>
              </TextIcon>
            </div>
          )}
          {workplace?.length > 0 && (
            <div>
              <TextIcon href={``} icon="place">{workplace}</TextIcon>
            </div>
          )}
          {icons && tel && (
            <div>
              <LinkIcon href={`tel:${tel}`} icon="phone_in_talk">
                {[...tel].map((c, i) => i % 2 ? c : `${c} `)}
              </LinkIcon>
            </div>
          )}
          {icons && email && (
            <div>
              <LinkIcon href={`mailto:${email}`} icon="contact_mail">
                {email}
              </LinkIcon>
            </div>
          )}
        </div>
      </span>
    </Card>
  );
}
