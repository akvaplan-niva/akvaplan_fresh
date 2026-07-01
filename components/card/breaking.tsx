import { t } from "@/text/mod.ts";
import { CardWithRelativeTime } from "@/components/card/types.ts";
import { Icon } from "@/components/icon.tsx";
import { LinkIcon } from "@/components/icon_link.tsx";
import { newsArticleURL, newsHref } from "@/services/nav.ts";

export const Breaking = (
  {
    news,
    lang,
    days = 3,
    max = 1,
  }: { days: number; max: number; lang: string; news: CardWithRelativeTime[] },
) => {
  const breaking = news.filter(({ ago }) => {
    const res = Temporal.Duration.compare(
      Temporal.Duration.from({ days }),
      ago,
    );
    return res > -1;
  }).slice(0, max);

  return breaking?.length < 1 ? null : (
    <div
      class="bottom-0 xl:bottom-4 invisible xl:visible"
      style="position: absolute; right: 2rem; z-index: 1000; padding: 1.25rem; background: var(--dark); max-width: min(100dvw,50rem);"
    >
      {breaking.map((
        { headline, href, type, ago },
      ) => (
        <p
          class="grid grid-cols-2"
          style={{ gridTemplateColumns: "1fr", paddingBlockEnd: "0rem" }}
        >
          <LinkIcon href={newsHref(lang)} icon="cell_tower">
            {`${t(`ui.Latest`)}`}
          </LinkIcon>{" "}
          <a href={href} class="text-xl">
            {headline}
          </a>
          <span
            class="text-md text-muted leading-tight"
            style={{ color: "var(--muted)" }}
          >
            ({ago?.toLocaleString(lang, { style: "narrow" })})
          </span>
        </p>
      ))}
    </div>
  );
};
