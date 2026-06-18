import type { ComponentChildren } from "preact";
import IconButton from "@/components/button/icon_button.tsx";
import Button from "@/components/button/button.tsx";

export const PrimaryButton = (
  { href, children, ...props }: { href: string; children: ComponentChildren },
) =>
  props?.icon
    ? (
      <IconButton
        iconHeight="1.5rem"
        iconWidth="1.5rem"
        {...props}
      >
        {children}
      </IconButton>
    )
    : (
      <Button
        {...props}
      >
        {children}
      </Button>
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
