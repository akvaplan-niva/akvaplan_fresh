import { getLatestResearchProjectCards } from "@/services/project.ts";
import { lang as langSignal, t } from "@/text/mod.ts";
import { buildOramaParams } from "@/routes/pubs.tsx";
import { search } from "@/search/search.ts";
import { getResearchTopics } from "@/data/home.ts";
import { getCachedPanelCard } from "@/kv/panel.ts";
import { ID_PROJECTS, ID_PUBLICATIONS, ID_RESEARCH } from "@/kv/id.ts";

import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { Naked } from "@/components/naked.tsx";
import { TightSqImgCard } from "@/components/cards.tsx";
import { MajorSection } from "@/components/major_section.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { SectionHeader } from "@/components/cards5.tsx";
import { Intro } from "@/components/intro.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { pubUrl } from "@/services/nav.ts";
import { MiniCard } from "@/components/card.tsx";
import { names } from "@/components/search_result_item.tsx";
import { slugify } from "@/services/mynewsdesk.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research|forskning)",
};

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  const hero = await getCachedPanelCard(ID_RESEARCH, lang);
  hero.eyebrow = t("nav.Research");
  const projectHero = await getCachedPanelCard(ID_PROJECTS, lang);
  const researchAreas = await getResearchTopics({ lang });

  const projects = getLatestResearchProjectCards({ lang, limit: 8 });

  const pubHero = await getCachedPanelCard(ID_PUBLICATIONS, lang);

  const { searchParams } = new URL(req.url);

  const oramaParams = buildOramaParams({ searchParams });
  oramaParams.limit = 8;
  const { where, term, facets } = oramaParams;
  where.type = "AcademicArticle";
  const { count } = await search({
    term: "",
    limit: 0,
    where,
  });
  const filters = new Map([["type", "AcademicArticle"]]);

  //const filters = buildF({ searchParams, where });
  // console.warn(oramaParams);
  const results = await search(oramaParams);
  const collection = "pubs";

  return (
    <Naked title={hero.headline}>
      <HeaderLogoStickyNav lang={lang} />

      <MajorSection>
        <Eyebrow text={hero.eyebrow} />
        <SectionHeader headline={hero.headline} />
        <Intro>{hero.intro}</Intro>

        <div class="max-w-[1920px] grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr] gap-[1.5rem] py-[1.5rem]">
          {researchAreas.map((card) => (
            <TightSqImgCard
              key={card.href}
              headline={card.headline}
              href={card.href}
              cloudinary={card.cloudinary}
            />
          ))}
        </div>
      </MajorSection>

      <MajorSection>
        <Eyebrow text={""} />
        <SectionHeader
          headline={projectHero.headline}
          cta={projectHero.cta}
          href={projectHero.href}
        />

        <div class="max-w-[1920px] grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr] gap-[1.5rem] py-[1.5rem]">
          {projects.map((card) => (
            <TightSqImgCard
              key={card.href}
              headline={card.headline}
              href={card.href}
              cloudinary={card.cloudinary}
            />
          ))}
        </div>
      </MajorSection>

      {
        /* <LatestResPubs
        results={results}
        pubHero={pubHero}
        lang={lang}
        req={req}
        collection={collection}
      />
       */
      }
    </Naked>
  );
});

export const LatestResPubs = (
  { collection, pubHero, results, lang, req },
) => (
  <>
    <Eyebrow text={"Peer reviewed"} />
    <SectionHeader headline={"Latest reserach article"} />
    <Intro>{pubHero?.intro}</Intro>

    <div>
      <ol
        style={{
          display: "block",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        }}
      >
        {results.hits?.map(({ score, document }) => (
          <OramePubItem
            key={document.id}
            document={document}
            score={score}
            etal={{ value: true }}
            lang={lang}
            collection={collection}
            base={req.url}
          />
        ))}
      </ol>
    </div>
  </>
);

export const OramePubItem = (
  {
    score,
    document,
    etal,
    base,
  },
) => {
  const {
    id,
    //href,
    collection,
    title,
    subtitle,
    container,
    published,
    authors,
    cloudinary,
    img512,
    thumb,
    intl,
    type,
  } = document;
  const lang = langSignal.value;
  const hreflang = document?.lang ?? lang;

  const name = intl && intl.name && intl.name[lang] ? intl.name[lang] : title;

  const _slug = intl && intl.slug && intl.slug[lang]
    ? intl.slug[lang]
    : document.slug;

  const slug = _slug ? _slug : `${slugify(name)}/${id}`;

  const _img = cloudinary
    ? `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_148,h_148,q_auto:good/${cloudinary}`
    : undefined;

  const img = _img ?? img512 ?? thumb ?? document.img;

  const href = "/en/pub/"; //pubUrl(document);

  return (
    <li
      title={score}
      style={{
        //fontSize: "2rem",
        margin: "1px",
        //padding: "0.5rem",
        background: "var(--surface0)",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: ".5rem",
          padding: ".25rem",
          gridTemplateColumns: "auto4fr",
        }}
      >
        {
          /* <a
          style={{
            placeContent: "center",
          }}
          href={href}
        >
          {img
            ? (
              <img
                style={{
                  // maxHeight: "1fr",
                  borderRadius: ".125rem",
                }}
                width="148"
                height="148"
                alt={name}
                src={img}
              />
            )
            : (
              <span style={{ padding: "1rem" }}>
                YEAR
              </span>
            )}
        </a> */
        }

        <MiniCard style={{ placeContent: "center" }}>
          <a
            href={href}
            _style={{ fontSize: "1rem" }}
          >
            <p class="h4" dangerouslySetInnerHTML={{ __html: name }} />
          </a>

          {authors?.length > 0
            ? (
              <p
                style={{ fontSize: "0.75rem" }}
                title={names(authors)}
                onClick={() => etal.value = false === etal.value ? true : false}
              >
                {etal?.value === true ? names(authors, 2) : names(authors)}
              </p>
            )
            : null}
          <p style={{ fontSize: "0.75rem" }}>
            <em>
              {subtitle ? subtitle : null}

              {container ? container + " " : null}
            </em>

            {published && !["person", "project"].includes(collection) &&
              `${published.substring(0, 10)}`}

            {!["image", "person"].includes(collection) && hreflang &&
                hreflang !== lang
              ? ` (${t(`lang.${hreflang}`)}) `
              : null} {/**[{t(`type.${type}`)}] */}
          </p>
        </MiniCard>
      </div>
    </li>
  );
};
