import { Icon } from "akvaplan_fresh/components/mod.ts";
import { JSX } from "preact";

import { Button } from "akvaplan_fresh/components/button/button.tsx";

// Here t breaks down (always translates to NO (at first ok, presumably on server, but after browser load it fails ?:/)
//import { t } from "akvaplan_fresh/text/mod.ts";

const handleClick = (e: MouseEvent) => {
  const query = e?.target?.dataset?.for ?? "dialog";
  const dialog = e.target?.ownerDocument?.querySelector(query);
  if (dialog) {
    const { open } = dialog;
    if (open) {
      //
    } else {
      dialog.showModal();
    }
  }
};

export default ({ children, ...props }: JSX.HTMLAttributes<HTMLElement>) => (
  <Button
    aria-label={props.label}
    onClick={handleClick}
    {...props}
    style={{ fontSize: "var(--font-size-4)", color: "var(--text2)" }}
  >
    {children}
    <Icon
      name="hamburger_menu_right"
      height="1.5rem"
      width="1.5rem"
      style={{
        marginRight: "0.25rem",
      }}
    />
    <span _class="hide-s">{props.lang === "no" ? "meny" : "menu"}</span>
  </Button>
);
