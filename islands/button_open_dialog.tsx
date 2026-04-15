import { t } from "akvaplan_fresh/text/mod.ts";
import { JSX } from "preact";
import Button from "akvaplan_fresh/components/button/button.tsx";
import IconButton from "akvaplan_fresh/components/button/icon_button.tsx";

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
    {
      //aria-label={lang === "en" ? "Open search/menu" : "Åpne søk/meny"}

      //popovertarget={popovertarget}
      ...props
    }
  >
    {children}
  </IconButton>
);
