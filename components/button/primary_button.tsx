import type { ComponentChildren } from "preact";

export const PrimaryButton = (
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
