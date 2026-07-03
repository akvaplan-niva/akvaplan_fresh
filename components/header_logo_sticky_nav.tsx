import { AkvaplanLogo } from "@/components/akvaplan/logo.tsx";
import { Menu } from "@/components/header/site_menu.tsx";
import { buildNav } from "@/services/nav.ts";
import { SiteLangLinks } from "@/components/site_lang_links.tsx";

//?import { majorSectionPaddingX } from "@/theming/config.ts";
// Prev revisions slightly tigher header? https://akvaplan-c7gzdvb1b4q4.apn.deno.net/
export const PushUnderLogoHeader = ({ children }) => (
  <div
    style={{
      paddingBlockStart: "4rem",
      paddingLeft: ".25rem",
      paddingRight: ".25rem",
    }}
  >
    {children}
  </div>
);

export function HeaderLogoStickyNav(
  { home = "/", lang, url, nav = buildNav(lang).slice(0, 4) },
) {
  const isScrolled = false;

  return (
    <header
      class={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "top-0 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        class={`mx-auto transition-all duration-500 bg-transparent`}
      >
        <div
          class={`flex items-center justify-between transition-all duration-500 px-6 _lg:px-8 ${
            isScrolled ? "h-0" : "h-20"
          }`}
        >
          <a href={home} class="flex items-center gap-0 group">
            <AkvaplanLogo width="164" class="backdrop-blur-sm" />
          </a>

          <div class="hidden lg:flex items-center gap-12">
            {nav.map((link) => (
              <a
                //@todo? add intert attr for current page? [https://usefresh.dev/docs/examples/active-links]
                key={link.text}
                href={link.href}
                style="font-family: var(--font-mono);"
                class="backdrop-blur-sm 
                font-mono font-medium
                text-sm uppercase 
                text-[var(--text0)]
                hover:decoration-[var(--accent)]
                hover:underline
                hover:underline-offset-8
                aria-[current]:text-[var(--text0)]
                aria-[current]:decoration-dotted
                underline-offset-auto
                transition-colors duration-300 relative group
                "
              >
                {link.text}
              </a>
            ))}

            <div class="text-sm">
              <SiteLangLinks url={url} />
            </div>
          </div>
          <div class="backdrop-blur-sm">
            <Menu lang={lang} />
          </div>
        </div>
      </nav>
    </header>
  );
}
