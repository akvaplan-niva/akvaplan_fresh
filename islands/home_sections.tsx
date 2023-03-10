import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";

export const buildSections = () => [
  { href: "/pubs", text: t("pubs") },
  {
    href: "/article/search",
    text: t("article"),
  },
  { "href": "/components", text: t("components") },
  { "href": "/pref", text: t("settings") },
];

export default function HomeSections() {
  const sections = buildSections();

  return (
    <nav>
      <ul>
        {sections.map(({ href, text }) => (
          <li>
            <a href={href}>
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
