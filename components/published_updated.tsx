import { lang as ls, t } from "@/text/mod.ts";
import { longDateIntl } from "@/routes/news/[slug].tsx";
export const PublishedUpdated = (
  { published, updated, lang }: {
    published: Date;
    updated: Date;
    lang: string;
  },
) => (
  <dl>
    <dt>
      {t("ui.Published")}
    </dt>
    <dd>
      <time>{published ? longDateIntl(published, lang ?? ls.value) : ""}</time>
    </dd>
    <dt>
      {t("ui.Updated")}
    </dt>
    <dd>
      <time>{updated ? longDateIntl(updated, lang ?? ls.value) : ""}</time>
    </dd>
  </dl>
);
