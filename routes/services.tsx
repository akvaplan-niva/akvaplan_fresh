import { ImageHeroWithSelectableImages } from "@/islands/HScrollWithDynamicImage.tsx";
import { getHomeServices } from "@/data/home.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";

import { Naked } from "@/components/naked.tsx";
import { t } from "@/text/mod.ts";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { ImgHero } from "@/components/hero/hero.tsx";
import { SqImgCard, TightSqImgCard } from "@/components/cards.tsx";

export const servicesHeroIntl = (lang) =>
  lang !== "en"
    ? ({
      headline: "Våre tjenester",
      id: "01hyd6qeqv4n3qrcv735aph6yy",
      cloudinary: "nektj2s3e7hr8kdgu1jj",
      intro: "Vi tilbyr et bredt spekter av forskningsbaserte tjenester",
      href: "/no/tjenester",
      cta: "Se våre tjenester",
      eyebrow: t("nav.Services"),
      desc:
        "Akvaplan-niva tilbyr forskningsbaserte tjenester for alle vann-tilknyttede miljøutfordringer, blant annet miljøovervåking, miljørisikoanalyser, konsekvensutredninger, beredskapsplaner, oseanografisk modellering, biologiske og kjemiske laboratorieanalyser og anleggssertifikat for akvakultur.\n" +
        " \n" +
        "Vi gir råd om løsninger for utslipp, avfallshåndtering, rensing og reduksjon av våre kunders økologiske fotspor.\n" +
        " \n" +
        "Vi bidrar til et forskningsbaserte beslutningsgrunnlag for innovasjon, verdiskaping og trygge miljøoperasjoner hos næringsliv og myndighetsaktører i Norge og internasjonalt.\n" +
        "\n" +
        "Akvaplan-niva tilbyr [akkrediterte tjenester](/no/akkreditering) for å sikre presisjon, sporbarhet og åpenhet i alle faser av våre prosjekt.",
    })
    : ({
      headline: "Services and advice",
      id: "01hyd6qeqv4n3qrcv735aph6yy",
      cloudinary: "nektj2s3e7hr8kdgu1jj",
      intro: "We offer a broad spectrum of research-based services and advice",
      href: "/no/tjenester",
      cta: "See our services",
      eyebrow: t("nav.Services"),
    });
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(services|tjenester)",
};

const imgUrl = (id: string) =>
  `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_746,h_746,q_auto:good/${id}`;
export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  const hero = servicesHeroIntl(lang);
  hero.cta = "";
  const services = await getHomeServices({ lang });
  const cta = t("ui.Read_more");

  return (
    <Naked title={hero.headline}>
      <HeaderLogoStickyNav lang={lang} />
      <ImgHero {...hero} />

      <div
        id="services"
        class="max-w-screen mx-auto"
      >
        {services.map((card) => (
          <ImgHero key={card.href} {...card} cta={cta} />
        ))}
      </div>
    </Naked>
  );
});

// import _services from "@/data/services.json" with { type: "json" };
// // FIXME Services page: 301 for /no/tjenester/tema/milj%C3%B8overv%C3%A5king & /no/tjenester/miljoovervaking/0618d159-5a99-4938-ae38-6c083da7da57

// import { Section } from "akvaplan_fresh/components/section.tsx";
// import { getPanelInLang, getPanelsInLang } from "akvaplan_fresh/kv/panel.ts";
// import { ID_SERVICES } from "akvaplan_fresh/kv/id.ts";

// import { defineRoute, type RouteConfig } from "$fresh/server.ts";
// import { Naked } from "akvaplan_fresh/components/naked.tsx";
// import { Markdown } from "akvaplan_fresh/components/markdown.tsx";
// import { Card } from "akvaplan_fresh/components/card.tsx";
// import { WideImage } from "akvaplan_fresh/components/wide_image.tsx";
// import { t } from "../text/mod.ts";
// import { Panel } from "@/@interfaces/panel.ts";
// import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
// import { ImageHero } from "@/components/hero/image_hero.tsx";
// import { sqImgUrl } from "@/services/cloudinary.ts";
// import { Eyebrow } from "@/components/eyebrow.tsx";
// import { serviceHref } from "@/services/mod.ts";
// const isVisible = true;
// const imgUrl = (id: string) =>
//   `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_746,h_746,q_auto:good/${id}`;

// export default defineRoute(async (req, ctx) => {
//   const { lang, page } = ctx.params;

//   const panels = (await getPanelsInLang({
//     lang,
//     filter: (p: Panel) => "service" === p.collection && p?.draft !== true,
//   })).sort((a, b) => a.title.localeCompare(b.title));

//   const _hero = (await getPanelInLang({ id: ID_SERVICES, lang })) ?? {
//     image: {
//       url:
//         "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920,ar_3:1/nektj2s3e7hr8kdgu1jj",
//     },
//     title: t("our.services"),
//   };

//   const { title, image, backdrop, theme } = _hero;

//   const hero = {
//     ..._hero,
//     headline: t("our.services"),
//     href: serviceHref(lang, "#services"),
//     intro: _hero.desc,
//     image: "", //https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920/nektj2s3e7hr8kdgu1jj",
//   };

//   const Svc = () => (
//     <div class="relative z-10 mt-0 lg:-mt-96 max-w-[1920px] mx-auto px-6 lg:px-12">
//       <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
//         {_services[lang]?.map((integration, index) => (
//           <div
//             key={integration.name}
//             class={`group relative overflow-hidden p-6 lg:p-8  transition-all duration-500 cursor-default ${
//               isVisible
//                 ? "opacity-100 translate-y-0"
//                 : "opacity-0 translate-y-8"
//             }`}
//             style={{
//               transitionDelay: `${index * 30 + 300}ms`,
//             }}
//           >
//             {/* Category tag */}
//             <span
//               class={`absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 transition-colors ${
//                 0 === index
//                   ? "bg-foreground text-background"
//                   : "bg-foreground/10 text-muted-foreground"
//               }`}
//             >
//               {integration.category}
//             </span>

//             {/* Logo */}
//             <div
//               class={`w-20 h-20 mb-6 flex items-center justify-center transition-colors ${
//                 0 === index ? "text-white" : "text-foreground/60"
//               }`}
//             >
//               <img
//                 headline={integration.headline}
//                 subtitle={integration.intro}
//                 src={sqImgUrl(integration.cloudinary, 128)}
//                 href={integration.href}
//               />
//             </div>

//             <span class="font-medium block">{integration.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <Naked title={title}>
//       <HeaderLogoStickyNav lang={lang} />

//       <ImageHero {...{ hero }} intro={<Svc />} />

//       <section
//         id="integrations"
//         class="relative overflow-hidden"
//       >
//         <div class="relative z-10 pt-32 lg:pt-40 text-balance text-center">
//           <Eyebrow text={t("nav.Services")} />

//           <h1 class="h1">{hero.headline}</h1>
//           <p
//             class={`mt-8 text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto transition-all duration-1000 delay-100 ${
//               isVisible ? "opacity-100" : "opacity-0"
//             }`}
//           >
//           </p>
//         </div>

//         {/* Full-width image */}
//         {
//           /* <div
//           class={`backdrop-blur relative left-1/2 -translate-x-1/2 w-screen -mt-16 transition-all duration-1000 delay-200 ${
//             isVisible ? "opacity-100" : "opacity-0"
//           }`}
//         >
//           <img
//             src="https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920/nektj2s3e7hr8kdgu1jj"
//             alt=""
//             aria-hidden="true"
//             class="w-full h-[400px] object-cover"
//           />
//         </div> */
//         }
//       </section>

//       <div
//         style={{
//           display: "grid",
//           placeItems: "center",
//           gridTemplateColumns: "1fr 1fr 1fr",
//         }}
//       >
//         {_services[lang]?.map(({ headline, href, cloudinary }) => (
//           <></>
//           // <TightSqImgCard
//           //   key={href}
//           //   image={imgUrl(cloudinary)}
//           //   headline={headline}
//           //   subtitle=""
//           //   href={href}
//           // />
//         ))}
//       </div>

//       <Section>
//         <Card>
//           {/* <h2>{t("services.About")}</h2> */}

//           <Section>
//             {hero?.desc && (
//               <Markdown
//                 text={hero.desc}
//                 style={{ fontSize: "1rem", whiteSpace: "pre-wrap" }}
//               />
//             )}

//             <a href="https://www.akkreditert.no/" target="_blank">
//               <WideImage
//                 style={{ background: "var(--light)", maxWidth: "10vh" }}
//                 url="/icon/logo/akkreditert.svg"
//                 lang={lang}
//               />
//             </a>
//           </Section>
//         </Card>
//       </Section>
//     </Naked>
//   );
// });
