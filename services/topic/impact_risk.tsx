import { MiniNewsCard, NewsFilmStrip } from "@/components/mod.ts";

const book = (lang) => ({
  href: `/${lang}/doi/10.1007/978-3-030-70176-5`,
  title: "Assessing Environmental Risk of Oil Spills with ERA Acute",
  published: "2021",
  type: "book",
  hreflang: "en",
  lang,
});
const pr = (lang) => ({
  href: `/${lang}/${
    lang === "no" ? "pressemelding" : "pressrelease"
  }/2021-05-18/ny-miljorisikometode-for-akutte-oljeutslipp`,
  title: "Ny miljørisikometode for akutte oljeutslipp",
  thumb:
    "https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,h_96,ar_1:1/n3bycrmerfzxiynzorz8",
  published: "2021-05-18",
  type: "pressrelease",
  hreflang: "no",
  lang,
});

const related = (lang) => [book(lang), pr(lang)];

const no = (
  <div class="page-header">
    <h2>SensE</h2>
    <p>
      <abbr title={"Sensitive Environments Decision Support Group"}>SensE</abbr>
      {" "}
      i Akvaplan-niva tilbyr metodeutvikling og en rekke tjenester innenfor
      miljørisiko og oljevernberedskap, primært for petroleumsoperasjoner og
      aktiviteter i sensitive marine områder, men også for andre næringer i
      havrommet.
    </p>

    <details open>
      <summary>Miljørisikoanalyser</summary>
      <p>
        Akvaplan-niva, ved SensE, gjennomfører prosjekter knyttet til
        metodeutvikling, datatilrettelegging og standardisering for norsk
        offshoreindustri. Analyser av miljørisiko for akutte oljeutslipp
        gjennomføres etter ERA Acute-metoden.
      </p>

      <NewsFilmStrip news={related("no")} lang="no" />
    </details>

    <details open>
      <summary>Oljevernberedskap</summary>
      <p>
        SensE arbeider med metodeutvikling og tjenester knyttet til analyse av
        beredskapsbehov for aktiviteter som kan medføre akutte oljeutslipp.
        SensE gjennomfører beredskapsanalyser for aktiviteter på norsk sokkel.
        På basis av feltundersøkelser utvikler vi detaljerte oljevernplaner for
        spesielt sensitive områder, til bruk i miljøstrategisk
        beredskapsplanlegging. SensE bidrar vesentlig til{" "}
        <a href="https://nofo.no/planverk">
          operatørenes planverk for oljevernberedskap
        </a>{" "}
        og gjennomfører beredskapsøvelser og trening i strategisk beredskap.

        Øvrig beslutningsstøtte: SensE arbeider med strukturering av data og
        resultater fra forskningsaktiviteter som grunnlag for beslutningsstøtte.
      </p>
    </details>

    <details open>
      <summary>Beslutningsstøtte</summary>
      <p>
        SensE arbeider med strukturering av data og resultater fra
        forskningsaktiviteter som grunnlag for beslutningsstøtte.
      </p>
    </details>
  </div>
);

const en = (
  <div class="page-header">
    <h2>Sensitive Environments Decision Support Group</h2>
    <p>
      <abbr title={"Sensitive Environments Decision Support Group"}>SensE</abbr>
      {" "}
      in Akvaplan-niva offers methodology development and a number of services
      within environmental risk and oil spill response. Primary clients are the
      petroleum and other offshore industries, particulary for activities in
      environmentally sensitive areas.
    </p>

    <details open>
      <summary>Environmental risk analyses</summary>
      <p>
        Akvaplan-niva/SensE carries out projects in methodology development,
        data adaptation and standardisation for the Norwegian offshore industry.
        Environmental risk assessments (ERAs) for acute oil spills are carried
        out using the ERA Acute methodology.
      </p>

      <NewsFilmStrip news={related("en")} lang="en" />
    </details>

    <details open>
      <summary>Oil spill response preparedness</summary>
      <p>
        Oil spill response preparedness analyses and planning: SensE develops
        methodology and services related to analysis of oil spill response
        contingency requirements for activities. Oil spill preparedness analyses
        are carried out for activities on the Norwegian Continental Shelf.
      </p>
      <p>
        Detailed oil spill preparedness plans for sensitive areas are based on
        field studies, for use in environmentally strategic contingency
        planning. SensE contributes substantially to the{"  "}
        <a href="https://nofo.no/planverk" hreflang="no" target="_blank">
          operating industry preparedness website (Norwegian)
        </a>{" "}
        and carry out oil spill exercises and activities related to strategic
        oil spill response.
      </p>
    </details>

    <details open>
      <summary>Decision support</summary>
      <p>
        SensE projects involve structuring of data and results from research
        activities as a foundation for decision support.
      </p>
    </details>
  </div>
);

export const sense = new Map([
  ["no", no],
  ["en", en],
]);
