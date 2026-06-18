import { peopleSearchHref } from "@/services/nav.ts";
import { t } from "@/text/mod.ts";

import { MajorSection } from "@/components/major_section.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";
import { Pill } from "@/components/button/pill.tsx";
import { ImgHero } from "@/components/hero/hero.tsx";
import type { Hero } from "@/components/card/types.ts";

const workplaceFacets = [
  ["Tromsø", 84],
  ["Alta", 5],
  ["Bodø", 5],
  ["Sortland", 3],
  ["Trondheim", 11],
  ["Bergen", 4],
  ["Stord", 1],
  ["Oslo", 5],
  ["Ski", 2],
  ["Reykjavík", 3],
] as const;

//["BIOLT",8],["OSEAN",13],["INSPM",13],["FISK",9],["LEDELS",9],["MILPÅ",12],["AKVA",5],["UTRED",12],["INNOV",10],["ØKOSY",10],["",1],["SENSE",3],["HAVTEK",5],["KJEMI",5],["STABS",8]]

const total = workplaceFacets.reduce((p, c) => p += +c[1], 0);

const peopleIntl = (lang: string) =>
  ({
    href: peopleSearchHref(),
    cta: t("people.See_all"),
    headline: t("our.people") ?? "",
    eyebrow: t("nav.People"),
    cloudinary: "viemsy7cszuo7laedtcd",
    intro: lang !== "en" ? "" : "",
  }) satisfies Hero;

export const WherePeopleWork = () => {
  return (
    <footer color-scheme="dark">
      <div
        class={`absolute bottom-0 lg:bottom-12 left-0 right-0 px-6 lg:px-12 transition-all duration-700 delay-500`}
      >
        {workplaceFacets.map((
          [location, count],
        ) => (
          <a
            href={peopleSearchHref() +
              `/workplace/${encodeURIComponent(location.toLowerCase())}`}
          >
            <span
              style="color: var(--text1);"
              _class="text-[clamp(1.25rem,1.25vw,2rem)] text-white"
            >
              {location}
              <Pill>
                {count}
              </Pill>
            </span>
          </a>
        ))}
      </div>
    </footer>
  );
};

export const PeopleHome = ({ id, lang }: { id: string; lang: string }) => {
  const { headline, eyebrow, cta, href, cloudinary, intro } = peopleIntl(lang);

  return (
    <MajorSection id={id}>
      <ImgHero
        eyebrow={eyebrow}
        headline={headline}
        href={href}
        cloudinary={cloudinary}
        intro={intro}
        cta={cta.replace(" ", ` ${total} `)}
        footer={<WherePeopleWork />}
      />
    </MajorSection>
  );
};
