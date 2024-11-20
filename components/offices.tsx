import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { offices, tromsø } from "akvaplan_fresh/services/offices.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";
import {} from "akvaplan_fresh/services/akvaplanist.ts";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { Icon2 as Icon } from "akvaplan_fresh/components/icon_link.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { peopleHref } from "akvaplan_fresh/services/mod.ts";

export const OfficeContactDetails = (
  {
    name = "Tromsø",
    post = name === "Tromsø" ? tromsø.post : undefined,
    visit = name === "Tromsø" ? tromsø.visit : undefined,
    email = tromsø.email,
    tel = tromsø.tel,
    lang,
  },
) => (
  <dl style="display: grid; grid-template-columns: auto 1fr;">
    <dt>
      <Icon name="place" />
    </dt>
    <dd style={{ color: "var(--text1)" }}>
      Akvaplan-niva{" "}
      <span
        href={peopleHref(lang, `workplace/${name}`)}
        style={{ color: "var(--accent)" }}
      >
        {name}
      </span>
      {visit ? ` (${visit})` : null}
    </dd>
    <dt>
      <Icon name="mail" />
    </dt>
    <dd>
      {post}
    </dd>

    <dt aria-label="mail">
      <Icon name="mail" />
    </dt>

    <dd>
      <a
        href={`mailto:${email}`}
      >
        {email}
      </a>
    </dd>

    <dt aria-label="ring">
      <Icon name="phone_in_talk" />
    </dt>
    <dd>
      <a
        href={`tel:${tel}`}
      >
        {tel}
      </a>
    </dd>
  </dl>
);

export const OfficeseList = () => (
  <Card>
    <menu>
      {[...offices.values()].filter(({ hq }) => true).map((
        { name },
      ) => (
        <li>
          <a
            href={`${intlRouteMap(lang).get("people")}/workplace/${
              name.split(" ").at(0)
            }`}
          >
            {name}
          </a>
        </li>
      ))}
    </menu>
  </Card>
);

export const MainContacts = () => (
  <Card>
    <dl>
      <dt>
        {t("ui.Telephone")}
      </dt>
      <dd>
        <a
          href={`tel:${akvaplan.tel}`}
        >
          <Icon name="phone_in_talk" /> {akvaplan.tel}
        </a>
      </dd>

      <dt>
        {t("ui.E-mail")}
      </dt>
      <dd>
        <a
          href={`mailto:${akvaplan.email}`}
        >
          <Icon name="mail" />
          {akvaplan.email}
        </a>
      </dd>
    </dl>
  </Card>
);

export const Offices = () => (
  <Section>
    <h2
      href={`${intlRouteMap(lang).get("people")}/workplace`}
    >
      {t("company.Office_addr_employees")}
    </h2>
    <ul>
      {[...offices.values()].filter(({ hq }) => true).map((
        { name },
      ) => (
        <li>
          <a
            href={`${intlRouteMap(lang).get("people")}/workplace/${
              name.split(" ").at(0)
            }`}
          >
            {name}
          </a>
        </li>
      ))}
    </ul>
  </Section>
);
