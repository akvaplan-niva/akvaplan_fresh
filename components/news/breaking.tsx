import { t } from "@/text/mod.ts";

export const Breaking = (
  {
    news,
    lang,
    days = 3,
    max = 1,
  }: { days: number; max: number; lang: string; news: NewsWithRelativeTime[] },
) => (
  <div
    class="bottom-0 xl:bottom-4 invisible xl:visible"
    style="position: absolute; right: 2rem; z-index: 1000; padding: 1.25rem; background: var(--dark); max-width: min(100dvw,50rem);"
  >
    {news.filter(({ ago }) => ago?.days < days).slice(0, max).map((
      { headline, href, type, ago },
    ) => (
      <p
        class="grid grid-cols-2"
        style={{ gridTemplateColumns: "1fr", paddingBlockEnd: "0rem" }}
      >
        <a href={href} class="text-xl">
          {headline}
        </a>
        <span
          class="text-md text-muted leading-tight"
          style={{ color: "var(--muted)" }}
        >
          {`${t(`type.${type}`)} (${
            ago?.toLocaleString(lang, { style: "narrow" })
          })`}
        </span>
      </p>
    ))}
  </div>
);
