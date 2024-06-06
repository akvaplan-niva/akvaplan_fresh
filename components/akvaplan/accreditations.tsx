import { Card } from "akvaplan_fresh/components/mod.ts";

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
import { SocialMediaIcons } from "akvaplan_fresh/components/social_media_icons.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

const akkreditertUrl = (lang) =>
  `https://www.akkreditert.no${lang === "en" ? `/en` : ""}`;

const akkreditertInspectionUrl = (lang: string) =>
  `${akkreditertUrl(lang)}/akkrediterte-organisasjoner/inspeksjon/?AkkId=542`;

const akkreditertLabUrl = (lang: string) =>
  `${
    akkreditertUrl(lang)
  }/akkrediterte-organisasjoner/akkrediteringsomfang/?AkkId=212`;

const LinkToStandard = ({ name, lang }) => {
  const [code, no, en] = standard.get(name) ?? [];
  return (
    <a
      href={`https://online.standard.no/${lang === "en" ? "en" : "nb"}/${code}`}
      target="_blank"
    >
      {lang === "en" && en ? en : no ?? name}
    </a>
  );
};

const LabAccreditations = ({ lang }) => (
  <>
    <p>
      Vi tilbyr følgende akkrediterte laboratorietjenester etter kravene i{" "}
      <LinkToStandard name="NS-EN ISO/IEC 17025:2017" lang={lang} />{" "}
      <em style={{ fontSize: "0.75rem" }}>NS-EN ISO/IEC 17025:2017</em>.
    </p>
    <p>
      <ul style={{ paddingLeft: "1.75rem", listStyleType: "disc" }}>
        <li>
          Kjemisk analyse
        </li>
        <li>
          Marine bunndyr (prøvetaking, analyse, taksonomi og faglige
          vurderinger)
        </li>
      </ul>
    </p>

    <p>
      Se vår akkreditering for laboratorier hos{" "}
      <a href={akkreditertLabUrl(lang)} target="_blank">
        Norsk akkreditering
      </a>{" "}
      <em style={{ fontSize: "0.75rem" }}>TEST 079</em>.
    </p>
  </>
);

const InspAccreditations = ({ lang }) => (
  <div>
    Akvaplan-niva er akkreditert for utsteding av anleggssertifikat og
    gjennomføring av lokalitetsundersøkelser i henhold til{" "}
    <a
      href={`/${lang}/pressemelding/2022-12-23/akvaplan-niva-er-akkreditert-for-nytek23`}
    >
      NYTEK23
    </a>, etter kravene i{" "}
    <LinkToStandard
      name="NS-EN ISO/IEC 17020:2012"
      lang={lang}
    />{" "}
    <em style={{ fontSize: "0.75rem" }}>NS-EN ISO/IEC 17020:2012</em>.

    <p>
      Se vår akkreditering for teknisk inspeksjon ac oppdrettsanlegg hos Norsk
      akkreditering:
      <a href={akkreditertInspectionUrl(lang)} target="_blank">
        INSP 013
      </a>
    </p>
  </div>
);

export const Accreditations = ({ lang, ...props }) => {
  return (
    <>
      <Section {...props}>
        <Card>
          <p>
            {/* {t("accred.Intro")} */}
            Akvaplan-niva tilbyr akkrediterte tjenester for å sikre presisjon,
            sporbarhet og åpenhet i alle faser av våre prosjekt.
          </p>
          <a
            href={akkreditertUrl(lang)}
            rel="noreferrer noopener"
            target="_blank"
          >
            <img
              src={"/icon/logo/akkreditert.svg"}
              alt={""}
              aria-disabled
              width={"96"}
              style={{
                //color: "pink",
                // invert colors
                // => trick to enable visibility on dark backgrounds
                // => nice side-effect is diffusing on light
                filter: "invert(.5)",
              }}
            />
          </a>

          <Section>
            <LabAccreditations lang={lang} />
          </Section>
          <Section>
            <InspAccreditations lang={lang} />
          </Section>
        </Card>
      </Section>
    </>
  );
};

// const AccredEn = ({ lang = "en" } = {}) => {
//   return (
//     <>
//       <Card>
//         <p>
//           Akvaplan-niva offers accredited services to ensure precision,
//           traceability, and transparency in all phases of our projects. We
//           provide accredited laboratory services for{"  "}
//           <a href={labURL(lang)} target="_blank">
//             chemical analysis, benthic fauna analysis, and taxonomy
//           </a>{" "}
//           , following{" "}
//           <LinkToStandard name="NS-EN ISO/IEC 17025:2017" lang={lang} />.
//         </p>
//       </Card>

//       <Card>
//         <p>
//           Akvaplan-niva is accredited for issuing{"  "}
//           <a href={inspURL(lang)} target="_blank">
//             capability certificate and locality classification
//           </a>{" "}
//           following{"   "}
//           <a
//             href={`/${lang}/pressemelding/2022-12-23/akvaplan-niva-er-akkreditert-for-nytek23`}
//           >
//             NYTEK23
//           </a>, and NS-EN ISO/IEC 17020 (
//           <LinkToStandard
//             name="NS-EN ISO/IEC 17020:2012"
//             lang={lang}
//           />).
//         </p>
//       </Card>
//     </>
//   );
// };

export const Certifications = ({ lang }) => (
  <Card>
    <p>
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
