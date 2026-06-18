import type { ComponentChildren } from "preact";
import IconButton from "@/components/button/icon_button.tsx";

export const PrimaryButton = (
  { href, children, ...props }: { href: string; children: ComponentChildren },
) => (
  <IconButton
    icon="search"
    iconHeight="1.5rem"
    iconWidth="1.5rem"
    {
      //aria-label={lang === "en" ? "Open search/menu" : "Åpne søk/meny"}

      //popovertarget={popovertarget}
      ...props
    }
  >
    {children}
  </IconButton>
);

export const PrimarySolidButton = (
  { href, children }: { href: string; children: ComponentChildren },
) => (
  <a
    href={href}
    class="button"
    color-scheme="dark"
    style={`background-color: var(--primary);
      color: var(--dark);
      font-size: .8rem;
      border-radius: 1.5rem;`}
  >
    {children}
  </a>
);
