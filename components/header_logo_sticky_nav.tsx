import { AkvaplanLogo } from "@/components/akvaplan/logo.tsx";
import { Menu } from "@/components/header/site_menu.tsx";
import { intlRouteMap } from "@/services/nav.ts";
import { t } from "@/text/mod.ts";
import type { StringSignal } from "@/@interfaces/signal.ts";

export const buildNav = (lang: string | StringSignal) => [
  { href: intlRouteMap(lang).get("akvaplanists"), text: t("nav.People") },
  { href: intlRouteMap(lang).get("projects"), text: t("nav.Projects") },
  { href: intlRouteMap(lang).get("pubs"), text: t("nav.Publications") },
];

export function HeaderLogoStickyNav({ lang }) {
  const navLinks = buildNav(lang);
  const isScrolled = false;
  const isMobileMenuOpen = false;
  return (
    <header
      class={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "top-0 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        class={`mx-auto transition-all duration-500 bg-transparent max-w-[1900px]`}
      >
        <div
          class={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <a href="#" class="flex items-center gap-0 group">
            <AkvaplanLogo width="164" class="backdrop-blur-sm" />
          </a>

          {/* Desktop Navigation */}
          <div class="backdrop-blur-sm hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.text}
                href={link.href}
                style="text-decoration: none; font-family: var(--font-mono);"
                class={`font-mono uppercase text-sm transition-colors duration-300 relative group ${
                  isScrolled
                    ? "text-foreground/70 hover:text-foreground"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.text}
                <span
                  class={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                    isScrolled ? "bg-foreground" : "bg-white"
                  }`}
                />
              </a>
            ))}
          </div>
          <div class="backdrop-blur-sm">
            <Menu lang="en" />
          </div>
        </div>
      </nav>
    </header>
  );
}
