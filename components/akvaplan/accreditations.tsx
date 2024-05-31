import { Card, CollectionHeader } from "akvaplan_fresh/components/mod.ts";

const standard = new Map([
  ["NS-EN ISO 14001", [
    "ns-en-iso-14001-2015",
    "Ledelsessystemer for miljø",
    "Environmental management systems",
  ]],
  [
    "NS-EN ISO/IEC 17025:2017",
    [
      "ns-en-isoiec-17025-2017",
      "Generelle krav til prøvings- og kalibreringslaboratoriers kompetanse",
      "General requirements for the competence of testing and calibration laboratories",
    ],
  ],
  [
    "NS-EN ISO/IEC 17020:2012",
    [
      "ns-en-isoiec-17020-2012",
      "Samsvarsvurdering — Krav til drift av ulike typer inspeksjonsorganer",
      "Conformity assessment — Requirements for the operation of various types of bodies performing inspection",
    ],
  ],
  [
    "NS-EN ISO 9001:2015",
    [
      "ns-en-iso-9001-2015",
      "Ledelsessystemer for kvalitet",
      "Quality management systems",
    ],
  ],
]);

import { t } from "akvaplan_fresh/text/mod.ts";

const _accred = { padding: "0.5rem" };

const inspURL = (lang: string) =>
  `https://www.akkreditert.no${
    lang === "en" ? "/en" : ""
  }/akkrediterte-organisasjoner/inspeksjon/?AkkId=542`;

const labURL = (lang: string) =>
  `https://www.akkreditert.no${
    lang === "en" ? "/en" : ""
  }/akkrediterte-organisasjoner/akkrediteringsomfang/?AkkId=212`;

const LinkToStandard = ({ name, lang }) => {
  const [code, no, en] = standard.get(name);
  return (
    <a
      href={`https://online.standard.no/${lang === "en" ? "en" : "nb"}/${code}`}
      target="_blank"
    >
      {lang === "en" && en ? en : no ?? name}
    </a>
  );
};

const AccredNo = ({ lang = "no" } = {}) => {
  return (
    <>
      <Card>
        <p style={_accred}>
          Akvaplan-niva tilbyr akkrediterte tjenester for å sikre presisjon,
          sporbarhet og åpenhet i alle faser av våre prosjekt. Vi tilbyr
          akkrediterte laboratorietjenester innen{" "}
          <a href={labURL(lang)} target="_blank">
            kjemisk analyse, marine bunndyr og taksonomi
          </a>
          , etter{" "}
          <LinkToStandard name="NS-EN ISO/IEC 17025:2017" lang={lang} />.
        </p>
      </Card>

      <Card>
        <p style={_accred}>
          Akvaplan-niva er akkreditert for utsteding av{" "}
          <a href={inspURL(lang)} target="_blank">
            anleggssertifikat og gjennomføring av lokalitetsundersøkelser
          </a>{" "}
          i henhold til{" "}
          <a
            href={`/${lang}/pressemelding/2022-12-23/akvaplan-niva-er-akkreditert-for-nytek23`}
          >
            NYTEK23
          </a>, etter{" "}
          <LinkToStandard
            name="NS-EN ISO/IEC 17020:2012"
            lang={lang}
          />.
        </p>
      </Card>
    </>
  );
};

const AccredEn = ({ lang = "en" } = {}) => {
  return (
    <>
      <Card>
        <p style={_accred}>
          Akvaplan-niva offers accredited services to ensure precision,
          traceability, and transparency in all phases of our projects. We
          provide accredited laboratory services for{"  "}
          <a href={labURL(lang)} target="_blank">
            chemical analysis, benthic fauna analysis, and taxonomy
          </a>{" "}
          , following{" "}
          <LinkToStandard name="NS-EN ISO/IEC 17025:2017" lang={lang} />.
        </p>
      </Card>

      <Card>
        <p style={_accred}>
          Akvaplan-niva is accredited for issuing{"  "}
          <a href={inspURL(lang)} target="_blank">
            capability certificate and locality classification
          </a>{" "}
          following{"   "}
          <a
            href={`/${lang}/pressemelding/2022-12-23/akvaplan-niva-er-akkreditert-for-nytek23`}
          >
            NYTEK23
          </a>, and NS-EN ISO/IEC 17020 (
          <LinkToStandard
            name="NS-EN ISO/IEC 17020:2012"
            lang={lang}
          />).
        </p>
      </Card>
    </>
  );
};

const Cert = ({ lang } = {}) => (
  <Card>
    <p style={_accred}>
      {t("cert.Intro")}
      <ul style={{ paddingLeft: "1.75rem", listStyleType: "disc" }}>
        <li>
          <LinkToStandard
            name="NS-EN ISO 9001:2015"
            lang={lang}
          />{" "}
          <em style={{ fontSize: "0.75rem" }}>NS-EN ISO 9001:2015</em>
        </li>

        <li>
          <LinkToStandard
            name="NS-EN ISO 14001"
            lang={lang}
          />{" "}
          <em style={{ fontSize: "0.75rem" }}>NS-EN ISO 14001</em>
        </li>
      </ul>
    </p>
  </Card>
);

export const Accreditations = ({ lang }) => (
  <div
    style={{
      display: "grid",
      gap: "1rem",
      gridTemplateColumns: "1fr",
    }}
  >
    {lang == "no" ? <AccredNo /> : <AccredEn />}
  </div>
);

export const Certifications = ({ lang }) => (
  <div
    style={{
      display: "grid",
      gap: "1rem",
      gridTemplateColumns: "1fr",
    }}
  >
    {lang == "no" ? <Cert lang="no" /> : <Cert lang="en" />}
  </div>
);
