import { JSX } from "preact";
import IconButton from "../components/button/icon_button.tsx";

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
  <IconButton
    aria-label={props.label}
    onClick={handleClick}
    icon="hamburger_menu_right"
    text={props.lang === "no" ? "meny" : "menu"}
    {...props}
  ></IconButton>
);
