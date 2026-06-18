import { LegacyStyles, MorgenStudioStyles } from "@/components/styles.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { MajorSection } from "@/components/major_section.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";

const news = JSON.parse(
  `[
  {"headline":"Autonomous Gliders in the Quest for Ocean Biodiversity - the eDepthNA project","cloudinary":"i132pjorybeaoza0f8qovh"},{"headline":"KAMPANJE - informasjon om sjøfugl ved oppdrettsanlegg","cloudinary":"xv6x3tjhasbx64b9e29hw1"},{"headline":"Reading the ocean's hidden animal communities - one DNA snippet at a time","cloudinary":"tc5ufx76y0s6jjhiveih0u"},{"headline":"Sea4Health prosjektet inviterer til workshop for tang og tareaktører i Tromsø","cloudinary":"ra3evfmib4nzazmyfiv0ud"},{"headline":"Merete Nygaard Kristiansen fratrer som administrerende direktør i Akvaplan-niva AS","cloudinary":"ixw8ysmfp3h1w4q36oaqxe"}]`,
);
const lang = "en";
const headline =
  "Rapidly melting Antarctic ice shelves may cause global sea levels to rise faster than expected";
const H2 = ({ children }) => <h2 class="h2">{children}</h2>;

export const RailwayHeroText = ({ headline }) => (
  <div class="relative z-10 md:pt-32 pt-24 md:pb-24 pb-12 px-4 lg:px-[159px] flex flex-col items-center text-center">
    <h1 class="font-medium text-white tracking-[-1.96px] leading-[1.12] text-[40px] sm:text-[54px]">
      {headline}
    </h1>
    {
      /* <p class="mt-6 text-white/80 text-[18px] sm:text-[20px] leading-7 max-w-[740px]">
      With the all-in-one{" "}
      <a
        href="/agents"
        class="underline hover:text-white transition-colors"
      >
        intelligent
      </a>{" "}
      cloud provider
    </p> */
    }
    {
      /* <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <a
        href="/new"
        class="px-6 py-3 rounded-[8px] bg-sl-accent text-white border border-transparent text-[18px] sm:text-[20px] leading-8 font-medium tracking-[-0.2px] dark:border-white/15 hover:brightness-110 transition-[filter] focus-visible:ring-white/30"
      >
        Deploy →
      </a>
      <a
        id="enterprise-calendar-embed"
        data-cal-namespace="work-with-railway"
        data-cal-link="forms/39ff44d5-8fea-4272-b863-f219faa89717"
        data-cal-config="{&quot;layout&quot;:&quot;month_view&quot;}"
        href="/#enterprise-calendar-embed"
        class="px-6 py-3 rounded-[8px] text-white text-[18px] sm:text-[20px] leading-8 font-medium tracking-[-0.2px] hover:bg-white/10 transition-colors focus-visible:ring-white/30 border border-white/50 dark:border-white/25 dark:bg-black/35"
      >
        Demo
      </a>
    </div> */
    }
  </div>
);

export default defineRoute((_req, _ctx) => {
  return (
    <div>
      <Head>
        <LegacyStyles />
        <MorgenStudioStyles />
      </Head>

      <HeaderLogoStickyNav lang={lang} />
      <ImageHero
        headline={""}
        intro={<H2>{headline}</H2>}
        cloudinary="of20wnxlsnsqzcp61p33o2"
      />
      <MajorSection>
        <div class="border-solid border-red-100">
          <Eyebrow text="New study" />

          <h1 class="h1">
            Rapidly melting Antarctic ice shelves may cause global sea levels to
            rise faster than expected
          </h1>
          <h2 class="h2" title="H2">
            Subheading (H2) at the edge of the Arctic
          </h2>
          <h4 class="h4" title="h4">
            Independent science. Forty years in the field.
          </h4>
        </div>
      </MajorSection>
      <MajorSection>
        <main class="body">
          Akvaplan-niva is a Norwegian non-profit research and consulting
          company. Our areas of expertise include the physical environment,
          biological diversity, and ecological processes in ocean and
          freshwater.
        </main>
      </MajorSection>
    </div>
  );
});
