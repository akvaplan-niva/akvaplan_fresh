import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { offices } from "akvaplan_fresh/services/offices.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { akvaplan } from "akvaplan_fresh/services/akvaplanist.ts";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { Icon2 as Icon } from "akvaplan_fresh/components/icon_link.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

export const MainOffice = ({ lang }) => (
  <dl style="display: grid; grid-template-columns: max-content auto;">
    <dt>
      <Icon name="place" />
    </dt>
    <dd>
      Tromsø (
      <a
        href={akvaplan.addr.hq.map}
        target="_blank"
        title={t("ui.Google_maps")}
      >
        Framsenteret
      </a>) og {offices.size - 1} andre{" "}
      <a
        href={`${intlRouteMap(lang).get("offices")}`}
      >
        steder
      </a>{" "}
      i Norge og på Island
    </dd>

    <dt aria-label="ring">
      <Icon name="phone_in_talk" />
    </dt>
    <dd>
      <a
        href={`tel:${akvaplan.tel}`}
      >
        {akvaplan.tel}
      </a>
    </dd>

    <dt aria-label="mail">
      <Icon name="mail" />
    </dt>

    <dd>
      <a
        href={`mailto:${akvaplan.email}`}
      >
        {akvaplan.email}
      </a>
      <br />
      {akvaplan.addr.hq.post}
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
