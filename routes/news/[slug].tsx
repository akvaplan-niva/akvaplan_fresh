import { LegacyStyles, MorgenStudioStyles } from "@/components/styles.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { MajorSection } from "@/components/major_section.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageCard, ImageHero } from "@/components/hero/image_hero.tsx";
import { cardFromItem, getNewsCardByMynewsdeskId } from "@/services/news.ts";
import {
  eventFilter,
  fetchContacts,
  fetchRelated,
  getItem,
  getItemBySlug,
} from "@/services/mynewsdesk.ts";
import { H1 } from "@/components/h.tsx";
import { cloudinaryImgUrl, heroImageUrl } from "@/services/cloudinary.ts";
import { Card } from "@/components/card.tsx";
import { ProjectsAsImageLinks } from "@/components/project_link.tsx";
import { SearchResults } from "@/components/search_results.tsx";
import { projectsByMynewsdeskId } from "@/services/project.ts";
import { PersonCard } from "@/components/person_card.tsx";
import { peopleIdsAsHits } from "@/components/markdown.tsx";
import { Naked } from "@/components/naked.tsx";
import { ImgHero } from "@/components/hero/hero.tsx";
import { ImgCard } from "@/components/cards.tsx";

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

  const item = id > 9999
    ? await getItem(id, type_of_media)
    : await getItemBySlug(slug, type_of_media);

  const card = item ? await cardFromItem(item) : null;
  if (!card) {
    return null;
  }
  item.links = item.links?.filter(({ text }) => "alternate" !== text);
  const _related = await fetchRelated(item);

  const projects = _related.filter(eventFilter).map((myn) =>
    projectsByMynewsdeskId.get(myn?.id)
  );

  const contacts = await fetchContacts(item);

  const { headline, caption, intro, body, cloudinary, image } = card;

  const eyebrowHeadline = (
    <>
      <Eyebrow text="Nyhet" />
      <H1>{headline}</H1>
    </>
  );
  const __html = body.replaceAll(",t_limit_1000", ",w_1782");

  return (
    <Naked>
      <Head>
        <LegacyStyles />
        <MorgenStudioStyles />
      </Head>
      <HeaderLogoStickyNav lang={lang} />
      <div color-scheme="dark" class="min-h-[66%]">
        <ImageCard
          headline={eyebrowHeadline}
          intro={caption}
          cloudinary={cloudinary}
        />
      </div>

      <div class="grid lg:grid-cols-[7fr_4fr] gap-12 -scroll-mt-12">
        <Card>
          <article
            style={{
              fontSize: "calc(1.25rem + 0.1vw)",
              lineHeight: 1.5,
              width: "100%",
              //maxWidth: "600px",
              margin: "0 auto",
            }}
            class="article-content"
            dangerouslySetInnerHTML={{ __html }}
          />
        </Card>
        <div>
          {/* People*/}

          {contacts?.length > 0 &&
            (
              <SearchResults
                hits={peopleIdsAsHits(contacts, lang)}
                display="grid"
              />
            )}

          <Card>
            {/* Projects*/}
            {projects?.length > 0 && (
              <ProjectsAsImageLinks
                projects={projects}
                lang={lang}
              />
            )}
          </Card>
        </div>
      </div>

      <Head>
        <link rel="stylesheet" href={asset("/css/article.css")} />
      </Head>
    </Naked>
  );
});
