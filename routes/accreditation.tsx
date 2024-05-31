import { Page } from "akvaplan_fresh/components/page.tsx";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";

interface NullProps {
  lang: string;
  base: string;
  title: string;
}

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no)/:page(accreditations|accreditation|akkreditering|akkreditert)",
};

export const handler: Handlers = {
  GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const title = t(params.page);
    const base = `/${params.lang}/${params.page}/`;
    return ctx.render({ lang, title, base });
  },
};
const no = (
  <main id="main" class="site-main">
    <header class="page-header">
      <div class="page-summary">
        <h1 class="page-title">Akkreditering/sertifisering</h1>
      </div>
    </header>
    <div class="page-content">
      <h3>Akkrediteringer</h3>
      <p>
        Akvaplan-niva er akkreditert av Norsk akkreditering iht.
        laboratoriestandarden NS-EN ISO 17025 med registreringsnummer{" "}
        <a
          href="https://www.akkreditert.no/akkrediterte-organisasjoner/akkrediteringsomfang/?AkkId=212"
          target="_blank"
          rel="noopener noreferrer"
        >
          TEST 079
        </a>{" "}
        og inspeksjonsstandarden NS-EN ISO 17020 med registreringsnummer{" "}
        <a
          href="https://www.akkreditert.no/akkrediterte-organisasjoner/inspeksjon/?AkkId=542"
          target="_blank"
          rel="noopener noreferrer"
        >
          INSP 013
        </a>.
      </p>
      <p>Vi utfører følgende oppdrag etter akkrediterte metoder.</p>
      <p>Oppdrag innen miljøovervåking og analysetjenester:</p>
      <ul>
        <li>
          Miljøovervåking av akvakulturanlegg: B-, C-, ASC- og
          C-/ASC-undersøkelser
        </li>
        <li>Miljøovervåking offshore</li>
        <li>Resipientundersøkelser</li>
        <li>Miljøkartlegging</li>
        <li>
          Kvantitative og semikvantitative undersøkelser av littoral og
          sublittoral hardbunn
        </li>
        <li>Prøvetaking av bløtbunn</li>
        <li>Prøvetaking av miljøgifter</li>
        <li>Sortering og identifisering av marine bløtbunnsprøver</li>
        <li>Vurdering og fortolkning av data</li>
        <li>Oppdrag innen kjemiske analyser</li>
        <li>Miljøgifter i sedimenter og biologisk materiale</li>
        <li>Kornstørrelse (Infiltrasjonsanlegg)</li>
        <li>Fysikalsk/ kjemiske målinger i olje</li>
      </ul>
      <p>Oppdrag innen tekniske inspeksjoner</p>
      <ul>
        <li>Anleggssertifikat</li>
        <li>Lokalitetsundersøkelse</li>
      </ul>
      <h3>Sertifiseringer</h3>
      <p>
        Akvaplan-nivas styringssystem for kvalitet er sertifisert etter
        kvalitetsstandarden NS-EN ISO 9001.
      </p>
      <p>
        Vi er prekvalifisert i leverandørdatabasen MAGNET JQS i henhold til den
        internasjonale kategoristandarden UNSPSC for tjenesteleveranser til
        operatørene på norsk sokkel.
      </p>
    </div>
  </main>
);
const en = (
  <main id="main" class="site-main">
    <header class="page-header">
      <div class="page-summary">
        <h1 class="page-title">Accreditation/certification</h1>
      </div>
    </header>
    <div class="page-content">
      <h3>Accreditations</h3>
      <p>
        Akvaplan-niva is accredited according to laboratory standard NS-EN ISO
        17025&nbsp; with registration number{" "}
        <a
          href="https://www.akkreditert.no/akkrediterte-organisasjoner/akkrediteringsomfang/?AkkId=212"
          target="_blank"
          rel="noopener noreferrer"
        >
          TEST 079
        </a>{" "}
        and inspection standard NS-EN ISO 17020 with registration number{" "}
        <a
          href="https://www.akkreditert.no/akkrediterte-organisasjoner/inspeksjon/?AkkId=542"
          target="_blank"
          rel="noopener noreferrer"
        >
          INSP 013
        </a>. We perform the following assignments according to accredited
        methods:
      </p>
      <p>Mission in environmental monitoring</p>
      <ul>
        <li>
          Environmental monitoring of aquaculture facilities: B, C, ASC and C /
          ASC surveys
        </li>
        <li>Environmental monitoring offshore</li>
        <li>Recipient investigations</li>
        <li>Environmental mapping</li>
        <li>
          Quantitative and semiquantitative surveys of littoral and sublittoral
          hard bottom
        </li>
        <li>Sampling of soft bottom fauna</li>
        <li>Sampling of environmental pollutants</li>
        <li>Sorting and identification of marine benthic samples</li>
        <li>Assessment and interpretation of data</li>
        <li>Assignments in chemical analyses</li>
        <li>Environmental hazards in sediments and biological material</li>
        <li>Grain size (infiltration plant)</li>
        <li>Physical / chemical measurements in oil</li>
      </ul>
      <p>Inspections</p>
      <ul>
        <li>Capability certificate</li>
        <li>Locality classification/site survey</li>
      </ul>
      <h3>Certification</h3>
      <p>
        Akvaplan-niva is certified according to the ISO 9001 quality standards.
      </p>
      <p>
        We are prequalified in the supplier database MAGNET JQS in accordance
        with the international category standard UNSPSC for service delivery to
        operators on the Norwegian continental shelf.
      </p>
    </div>
  </main>
);

export function Accreditations(
  { data: { title, lang, base } }: PageProps<NullProps>,
) {
  return (
    <Page title={title} base={base}>
      {lang.value === "en" ? en : no}
    </Page>
  );
}
