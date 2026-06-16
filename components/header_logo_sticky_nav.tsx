import { AkvaplanLogo } from "@/components/akvaplan/logo.tsx";
import { Menu } from "@/components/header/site_menu.tsx";
import { buildNav } from "@/services/nav.ts";
import { SiteLangLinks } from "@/components/site_lang_links.tsx";
import { majorSectionPaddingX } from "@/theming/config.ts";

export function HeaderLogoStickyNav(
  { home = "/", lang, nav = buildNav(lang).slice(0, 4) },
) {
  const isScrolled = false;
  return (
    <header
      class={`fixed z-50 transition-all duration-500 ${majorSectionPaddingX} ${
        isScrolled ? "top-0 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        class={`mx-auto transition-all duration-500 bg-transparent`}
      >
        <div
          class={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-0" : "h-20"
          }`}
        >
          <a href={home} class="flex items-center gap-0 group">
            <AkvaplanLogo width="164" class="backdrop-blur-sm" />
          </a>

          <div class="backdrop-blur-sm hidden lg:flex items-center gap-12">
            {nav.map((link) => (
              <a
                key={link.text}
                href={link.href}
                style="text-decoration: none; font-family: var(--font-mono);"
                class="font-mono font-medium uppercase text-sm text-white transition-colors duration-300 relative group"
              >
                {link.text}
                <span class="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full bg-white" />
              </a>
            ))}

            <div class="text-sm">
              <SiteLangLinks />
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
