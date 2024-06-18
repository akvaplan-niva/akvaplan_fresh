// FIXME PeopleCard: Priors with ID should use gray symbol and no email
// https://akvaplan.no/no/nyhet/2021-04-26/tynn-men-fet-fisken-tverrhalet-langebarn-utgjor-en-energibombe-i-de-arktiske-hav
// http:/localhost:7777/no/folk/name/Biuw/Martin
import { buildAkvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import { priorAkvaplanistID } from "akvaplan_fresh/services/prior_akvaplanists.ts";
import { peopleURL, personURL } from "akvaplan_fresh/services/nav.ts";

import { Card, Icon, UseApnSym } from "akvaplan_fresh/components/mod.ts";

import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";

import { type Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";

import { Head } from "$fresh/runtime.ts";

interface PeopleProps {
  id?: string;
  person?: Akvaplanist;
  lang?: string;
  icons: boolean;
}
const people = await buildAkvaplanistMap();

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
        <link rel="stylesheet" href="/css/people-card.css" />
      </Head>

      <div class="people-name">
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
      {isPrior(person)
        ? (
          <span style={{ fontSize: ".8rem" }}>
            {t("people.akvaplanist(prior)")}
          </span>
        )
        : (
          <span>
            <span class="people-position">
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
                <a
                  class="people-workplace"
                  href={`${peopleURL({ lang })}/management`}
                >
                  {t("people.Management")}
                </a>
              )}
            </div>

            <div class="people-workplace">
              {section && section !== "LEDELS"
                ? (
                  <a
                    style={{ color: "var(--text2)" }}
                    href={`${peopleURL({ lang })}/section/${
                      section.toLocaleLowerCase("no")
                    }`}
                  >
                    {t(`section.${section}`)}
                  </a>
                )
                : null}
            </div>
            {workplace?.length > 0 && (
              <div class="people-workplace">
                <a
                  href={`${peopleURL({ lang })}/workplace/${
                    workplace.toLocaleLowerCase("no")
                  }`}
                  style={{ color: "var(--text2)" }}
                >
                  {workplace}
                </a>
              </div>
            )}

            <p style={{ marginTop: "1rem" }}></p>
            {icons && (
              <div class="people-workplace">
                {tel && (
                  <span>
                    <a
                      href={`tel:${tel}`}
                      style={{ color: "var(--text2)" }}
                    >
                      <Icon name="phone_in_talk">
                      </Icon>

                      {[...tel].map((c, i) => i % 2 ? c : `${c} `)}
                    </a>
                  </span>
                )}
              </div>
            )}
            {icons && (
              <div class="people-workplace">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    style={{ color: "var(--text2)" }}
                  >
                    <Icon name="contact_mail" /> {email}
                  </a>
                )}
              </div>
            )}
          </span>
        )}
    </Card>
  );
}
