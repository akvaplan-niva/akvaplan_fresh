import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { offices } from "akvaplan_fresh/services/offices.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { akvaplan } from "akvaplan_fresh/services/akvaplanist.ts";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { Icon } from "akvaplan_fresh/components/icon.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

export const MainOffice = ({ lang }) => (
  <dl style="display: grid; grid-template-columns: max-content auto;">
    <dt>
      <a
        href="https://goo.gl/maps/P73K9hcVKeKd7jkz5"
        target="_blank"
        title={t("ui.Google_maps")}
      >
        <Icon name="place" aria-ignore />
      </a>
      {" "}
    </dt>
    <dd>
      Tromsø (Framsenteret)
    </dd>

    <dt aria-label="ring">
      <Icon name="phone_in_talk" aria-ignore />
    </dt>
    <dd>
      <a
        href={`tel:${akvaplan.tel}`}
      >
        {akvaplan.tel}
      </a>
    </dd>

    <dt aria-label="mail">
      <Icon name="mail" aria-ignore />
    </dt>

    <dd>
      <a
        href={`mailto:${akvaplan.email}`}
      >
        {akvaplan.email}
      </a>{" "}
      | {akvaplan.addr.hq.post}
    </dd>
  </dl>
);

export const Offices = () => (
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

export const Addresses = () => (
  <div>
    <Section>
      <h1>{t("about.HQ")}</h1>

      <MainOffice />
    </Section>

    {
      /* <section style={_section}>
      <h1 style={_header}>{t("about.Identification")}</h1>
      <dl>
        <dt>
          {t("about.Organisasjonsnummer")}
        </dt>
        <dd>
          <a
            href="https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=937375158"
            target="_blank"
          >
            937375158
          </a>
        </dd>
        <dt>
          <abbr title={"Research Organization Registry"} lang="en">
            ROR
          </abbr>{" "}
          ID:
        </dt>
        <dd>
          <a
            href=" https://ror.org/03nrps502"
            target="_blank"
          >
            https://ror.org/03nrps502
          </a>
        </dd>
      </dl>
    </section> */
    }

    <Section>
      <h2
        href={`${intlRouteMap(lang).get("people")}/workplace`}
      >
        {t("company.Offices")}
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
  </div>
);
