// FIXME PeopleCard: Priors with ID should use gray symbol and no email
// https://akvaplan.no/no/nyhet/2021-04-26/tynn-men-fet-fisken-tverrhalet-langebarn-utgjor-en-energibombe-i-de-arktiske-hav
// https://akvaplan.no/no/folk/name/Biuw/Martin
import { akvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
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
const people = await akvaplanistMap();

export function PeopleCard(
  {
    person,
    lang = langSignal.value,
    id,
    icons = true,
  }: PeopleProps,
) {
  if (id) {
    person = people.get(id) ??
      priorAkvaplanistID.get(id) ??
      {};
  }

  const {
    tel,
    email,
    name,
    given,
    family,
    position,
    unit,
    workplace,
    management,
    responsibility,
  } = person ?? {};

  return (
    <Card customClass="people-card">
      <Head>
        <link rel="stylesheet" href="/css/article.css" />
        <link rel="stylesheet" href="/css/people-card.css" />
      </Head>

      <div class="people-name">
        {name?.length > 1
          ? <span>{name}</span>
          : (
            <a href={personURL({ id, given, family, lang })}>
              <span style={{ color: "var(--text1)" }}>{given}</span>
              &nbsp;
              <span style={{ color: "var(--text2)" }}>{family}</span>
            </a>
          )}
      </div>
      <UseApnSym
        width="2rem"
        height="2rem"
        style={person.prior === true ? { filter: "grayscale(1)" } : {}}
      />{" "}
      {person.prior === true && <span>{t("people.akvaplanist(prior)")}</span>}
      <span class="people-position">
        {position?.[lang ?? "no"] ?? ""}
      </span>

      {responsibility && (
        <div class="people-workplace">
          {responsibility?.[lang ?? "no"] ?? ""}
        </div>
      )}

      <div class="people-workplace">
        {unit && unit !== "LEDELS" && (
          <a
            style={{ color: "var(--text2)" }}
            href={`${peopleURL({ lang })}/unit/${unit}`}
          >
            {t(`unit.${unit}`)}
          </a>
        )}
      </div>
      {workplace?.length > 0 && (
        <div class="people-workplace">
          <a
            href={`${peopleURL({ lang })}/workplace/${workplace}`}
            style={{ color: "var(--text2)" }}
          >
            {workplace}
          </a>
        </div>
      )}

      {management === true && (
        <a
          class="people-workplace"
          href={`${peopleURL({ lang })}/management`}
        >
          {t("people.Management")}
        </a>
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
    </Card>
  );
}
