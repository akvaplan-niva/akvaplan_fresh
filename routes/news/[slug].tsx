import { LegacyStyles, MorgenStudioStyles } from "@/components/styles.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { MajorSection } from "@/components/major_section.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";
import { getNewsCardByMynewsdeskId } from "@/services/news.ts";
import { getItemBySlug } from "@/services/mynewsdesk.ts";
import { H1, H2 } from "@/components/h.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(no|en){/akvaplan-niva}?/:type(news|nyhet|blog|pressreleases|pressrelease|pressemelding){/:isodate}?/:slug",
};

const typeOfMedia = (type: string) => {
  const _type = type.substring(0, 4).toLowerCase();
  switch (_type) {
    case "pres":
      return "pressrelease";
    case "blog":
      return "blog_post";
    default:
      return "news";
  }
};

export default defineRoute(async (_req, ctx) => {
  const { slug, lang, type } = ctx.params;

  const type_of_media = typeOfMedia(type);

  const id = Number(slug?.split("-").at(-1));

  const card = id > 9999
    ? await getNewsCardByMynewsdeskId(id, type_of_media)
    : await getItemBySlug(slug, type_of_media);

  if (!card) {
    return null;
  }
  console.warn({ card });
  const { headline, caption, intro, body, image } = card;

  const eyebrowHeadline = (
    <>
      <Eyebrow text="Nyhet" />
      <H1>{headline}</H1>
    </>
  );

  return (
    <div>
      <Head>
        <LegacyStyles />
        <MorgenStudioStyles />
      </Head>
      <HeaderLogoStickyNav lang={lang} />
      <div color-scheme="dark">
        <ImageHero
          headline={eyebrowHeadline}
          intro={caption}
          image={image}
        />
      </div>
      <MajorSection>
        <article class="prose prose-xl prose-slate">
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </article>
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
