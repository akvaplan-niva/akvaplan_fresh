import { intlRouteMap } from "@/services/nav.ts";
import { offices, tromsø } from "@/services/offices.ts";
import { lang, t } from "@/text/mod.ts";
import { Card } from "@/components/card.tsx";
import { Icon2 as Icon } from "@/components/icon_link.tsx";
import { Section } from "@/components/section.tsx";
import { peopleHref } from "@/services/mod.ts";
import { SearchResults } from "@/components/search_results.tsx";

const officesAsHits = (lang) =>
  [...offices.values()].map((document) => {
    const { name } = document;
    document.collection = "office";
    //document.lang = lang;
    document.id = "";
    document.title = name;
    document.slug = name.toLocaleLowerCase("no");

    return {
      document,
      score: null,
    };
  });

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
    <dt style={{ color: "var(--text1)" }}>
      Akvaplan-niva
    </dt>
    <dd
      href={peopleHref(lang, `workplace/${name}`)}
      style={{ color: "var(--accent)" }}
    >
    </dd>
    {visit
      ? (
        <>
          <dt>
            <Icon name="place" />
          </dt>
          <dd style={{ color: "var(--text1)" }}>
            {visit}
          </dd>
        </>
      )
      : null}
    <dt>
      <Icon name="mail" />
    </dt>
    <dd>
      {post}
    </dd>

    <dt aria-label="e-mail">
      <Icon name="alternate_email" />
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
    {
      /* <h2
      href={`${intlRouteMap(lang).get("people")}/workplace`}
    >
      {t("company.Office_addr_employees")}
    </h2> */
    }
    <SearchResults hits={officesAsHits(lang)} lang={lang} />
  </Section>
);
