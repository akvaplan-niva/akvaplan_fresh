import { t } from "akvaplan_fresh/text/mod.ts";
import { JSX } from "preact";
import IconButton from "../components/button/icon_button.tsx";

// Here t breaks down (always translates to NO (at first ok, presumably on server, but after browser load it fails ?:/)
// aria-label={props.label ?? t("menu.open_menu")}
// title={props.label ?? t("menu.open_menu")}
const handleClick = (e: MouseEvent) => {
  const query = e?.target?.dataset?.for ?? "dialog";
  const dialog = e.target?.ownerDocument?.querySelector(query);
  if (dialog) {
    const { open } = dialog;
    if (open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }
};

export default (
  { children, ...props }: JSX.HTMLAttributes<HTMLButtonElement>,
) => (
  <IconButton
    onClick={handleClick}
    icon="search"
    iconHeight="1.5rem"
    iconWidth="1.5rem"
    popovertargetaction="show"
    aria-label={t("menu.open")}
    //popovertarget={popovertarget}
    {...props}
  >
  </IconButton>
);
