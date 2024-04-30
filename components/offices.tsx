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

export const MainOffice = () => (
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
);

export const Addresses = () => (
  <div>
    <section style={_section}>
      <h1 style={_header}>{t("about.HQ")}</h1>

      <MainOffice />
    </section>

    <section style={_section}>
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

    <section style={_section}>
      <h1 style={_header}>{t("about.Other_media")}</h1>

      <Card>
        <dl>
          <dt>
            {t("about.Social_media")}
          </dt>
          <dd>
            <a
              href="https://facebook.com/Akvaplan/"
              target="_blank"
            >
              Facebook
            </a>
          </dd>
          <dd>
            <a
              href="https://no.linkedin.com/company/akvaplan-niva"
              target="_blank"
            >
              LinkedIn
            </a>
          </dd>
          <dd>
            <a
              href=" https://www.mynewsdesk.com/no/akvaplan-niva"
              target="_blank"
            >
              Mynewsdesk
            </a>
          </dd>

          <dd>
            <a
              href="https://twitter.com/AkvaplanNiva"
              target="_blank"
            >
              Twitter
            </a>
          </dd>
          <dt>
            {t("about.Open_access")}
          </dt>
          <dd>
            <a
              href="https://zenodo.org/communities/akvaplan-niva"
              target="_blank"
            >
              Zenodo
            </a>
          </dd>
          <dd>
            <a
              href="https://github.com/akvaplan-niva"
              target="_blank"
            >
              GitHub
            </a>
          </dd>
          <dt>
            Video
          </dt>
          <dd>
            <a
              href="https://www.youtube.com/channel/UCD-AkBT1riN6TeNDzBP7g8g"
              target="_blank"
            >
              YouTube
            </a>
          </dd>
        </dl>
      </Card>
    </section>
  </div>
);
