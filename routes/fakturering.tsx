import {
  Card,
  Page,
  PeopleCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";
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
    "{/:lang(en|no)}?/:page(fakturering|faktura|invoicing|invoice)",
};

const Fakturering = () => (
  <article>
    <Card>
      <p>
        For å sikre en raskere og mer effektiv behandling av inngående fakturaer
        har Akvaplan-niva innført elektronisk fakturabehandling.
      </p>
      <br />
      <p>
        Vi er registrert i ELMA-registeret, og kan ta imot EHF- faktura
        (Elektronisk Handelsformat).
      </p>
      <br />

      Den elektroniske adressen som skal benyttes ved innsending av EHF
      fakturaer, er vårt organisasjonsnummer: 937 375 158
      <br />
      <br />

      Dersom dere ikke har mulighet å sende EHF faktura, ber vi om at følgende
      e-postadresse benyttes ved forsendelse av faktura:
      <a href="mailto:fakturamottak@akvaplan.niva.no">
        fakturamottak@akvaplan.niva.no
      </a>
      <br />
      <br />
      Faktura må sendes i PDF format, og det kan kun være en faktura / en
      kreditnota pr PDF. Fakturaer og kreditnotaer skal adresseres:
      <br />
      Akvaplan-niva AS Fram Centre, Postbox 6606, Stakkevollan, 9296 Tromsø
      <br />
      Krav til merking av faktura Utover kravene om salgsdokumentasjon ihht
      bokføringsloven må alle fakturaer inneholde følgende:
      <br />
      <br />
      «Deres ref» feltet må inneholde navnet på personen hos oss som har bestilt
      varen / tjenesten. Faktura og eventuelle underbilag skal ikke stiftes
      sammen – benytt binders ved behov. Skriften på fakturaen må være tydelig
      <br />
      <br />
      Vår betalingsfrist er på minimum 15 dager på alle fakturaer.
    </Card>
  </article>
);

const Invoicing = () => (
  <div class="page-content">
    <p>
      Akvaplan-niva has changed its procedures regarding receipt of invoices to
      electronic invoice processing. We are registrated in the ELMA register and
      can receive EHF-invoices.
    </p>
    <br />
    <p>
      The electronic address for use of EHF invoices is our organisation number:
      937 375 158
    </p>
    <br />
    <p>
      Alternatively the following address can be used:{" "}
      <a href="mailto:fakturamottak@akvaplan.niva.no">
        fakturamottak@akvaplan.niva.no
      </a>
    </p>
    <br />
    <p>
      The invoice must be in PDF format and you could only have one invoice
      /credit note pr PDF file only. Correct address: for invoices/credit notes
      is:
    </p>
    <p style="padding-left: 40px;">
      Akvaplan-niva AS<br />
      Fram Centre,<br />
      Postbox 6606,<br />
      Stakkevollan,<br />
      9296 Tromsø
    </p>
    <br />
    <h4>Requirements for invoice marking</h4>
    <p>
      In addition to the requirements for sales documentation in accordance with
      the Accounting Act, all invoices must include the following information:
    </p>
    <ul>
      <li>
        “Your Reference” must contain the name of the person who has ordered the
        item/service.
      </li>
      <li>
        Invoices and any sub-attachments should not be stapled – please use
        paper clips as needed.
      </li>
      <li>The writing on the invoice must be clear.</li>
    </ul>
    <p>We require a minimum of 15 days payment on all invoices.</p>
    <p>
      Any questions can be directed to Kirsti Isaksen, Financial Manager
      (<a href="mailto:kis@akvaplan.niva.no">kis@akvaplan.niva.no</a>).
    </p>
  </div>
);

export const handler: Handlers = {
  GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const title = params.lang === "en" ? "Invoicing" : "Faktuering";
    const base = `/${params.lang}/${params.page}/`;
    return ctx.render({ lang, title, base });
  },
};

export default function PageFakturering(
  { data: { title, lang, base } }: PageProps<NullProps>,
) {
  return (
    <Page title={title} base={base}>
      <h1>
        {title}
      </h1>
      <PersonCard id="kis" />
      {lang.value === "en" ? <Invoicing /> : <Fakturering />}
    </Page>
  );
}
