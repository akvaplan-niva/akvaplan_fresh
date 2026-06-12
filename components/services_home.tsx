import { Card } from "@/components/card/types.ts";
import { ImageHero } from "@/components/hero/image_hero.tsx";

const hero = {
  id: "01hyd6qeqv4n3qrcv735aph6yy",
  image:
    "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920/nektj2s3e7hr8kdgu1jj",
  intro:
    "Akvaplan-niva tilbyr et bredt spekter av forskningsbaserte tjenester og kostnadseffektive løsninger for vann-tilknyttede miljøutfordringer",
  href: "/no/tjenester",
  cta: "Se våre tjenester",
  desc:
    "Akvaplan-niva tilbyr forskningsbaserte tjenester for alle vann-tilknyttede miljøutfordringer, blant annet miljøovervåking, miljørisikoanalyser, konsekvensutredninger, beredskapsplaner, oseanografisk modellering, biologiske og kjemiske laboratorieanalyser og anleggssertifikat for akvakultur.\n" +
    " \n" +
    "Vi gir råd om løsninger for utslipp, avfallshåndtering, rensing og reduksjon av våre kunders økologiske fotspor.\n" +
    " \n" +
    "Vi bidrar til et forskningsbaserte beslutningsgrunnlag for innovasjon, verdiskaping og trygge miljøoperasjoner hos næringsliv og myndighetsaktører i Norge og internasjonalt.\n" +
    "\n" +
    "Akvaplan-niva tilbyr [akkrediterte tjenester](/no/akkreditering) for å sikre presisjon, sporbarhet og åpenhet i alle faser av våre prosjekt.",
  headline: "Våre tjenester",
  eyebrow: "",
  subtitle:
    "Akvaplan-niva tilbyr et bredt spekter av forskningsbaserte tjenester og kostnadseffektive løsninger for vann-tilknyttede miljøutfordringer",
};

export function ServicesHome(
  { id, cards, lang }: { id: string; cards: Card[]; lang: string },
) {
  // export function
  //   const eyebrow = t("nav.Services");
  //   const href = intlRouteMap(lang).get("services")!;
  //   const cta = t("services.See_all_services");
  //   const headline = t("our.services");
  //   return (
  //     <div class="max-w-[1920px] mx-auto">
  //       <Eyebrow href={href} text={eyebrow} />
  //       <SectionHeader headline={headline} cta={cta} href={href} />
  //       <Cards1plus4 cards={cards} />
  //     </div>
  //   );
  // }
  const integrations = cards.map((c) => ({
    ...c,
    name: c.headline,
    category: "cat",
  }));

  const isVisible = true;

  return (
    <section
      id={id}
    >
      <ImageHero {...hero} />
    </section>
  );
}
