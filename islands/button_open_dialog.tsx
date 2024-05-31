import { t } from "akvaplan_fresh/text/mod.ts";
import { JSX } from "preact";
import Button from "akvaplan_fresh/components/button/button.tsx";

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
  { lang, children, ...props }: JSX.HTMLAttributes<HTMLButtonElement>,
) => (
  <Button
    onClick={handleClick}
    icon="search"
    iconHeight="1.5rem"
    iconWidth="1.5rem"
    popovertargetaction="show"
    aria-label={lang === "en" ? "Open menu" : "Åpne meny"}
    {
      //popovertarget={popovertarget}
      ...props
    }
  >
    {lang === "en" ? "Menu" : "Meny"}
  </Button>
);
