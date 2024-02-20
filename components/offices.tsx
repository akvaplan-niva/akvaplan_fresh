import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { offices } from "akvaplan_fresh/services/offices.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { akvaplan } from "akvaplan_fresh/services/akvaplanist.ts";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { Icon } from "akvaplan_fresh/components/icon.tsx";
const _section = {
  marginTop: "2rem",
  marginBottom: "3rem",
};
const _header = {
  marginBlockStart: "1rem",
  marginBlockEnd: "0.5rem",
};
export const Offices = () => (
  <div>
    <section style={_section}>
      <h1 style={_header}>{t("about.HQ")}</h1>

      <Card>
        <dl>
          <dt>Akvaplan-niva</dt>
          <dd>{akvaplan.addr.hq.post}</dd>

          <dt>
            {t("about.Visit")}
          </dt>
          <dd>
            {akvaplan.addr.hq.visit} (<a
              href="https://goo.gl/maps/P73K9hcVKeKd7jkz5"
              target="_blank"
            >
              {t("ui.Google_maps")}
            </a>)
          </dd>

          <dt>{t("about.Invoice")}</dt>
          <dd>
            <a href={intlRouteMap(lang).get("invoicing")}>
              {t("about.Invoicing")}
            </a>
          </dd>

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
    </section>
    <section style={_section}>
      <h1 style={_header}>{t("about.Office_locations")}</h1>
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
    </section>
  </div>
);
