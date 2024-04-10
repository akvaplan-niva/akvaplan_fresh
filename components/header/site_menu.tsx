import SiteNavDialog from "akvaplan_fresh/components/site_menu_dialog.tsx";
import ButtonOpenDialog from "akvaplan_fresh/islands/button_open_dialog.tsx";

export const SiteSearchDialog = ({ lang }) => (
  <span
    style={{
      display: "grid",
      justifyContent: "end",
      _padding: "var(--size-3) 0",
    }}
  >
    <nav>
      <ButtonOpenDialog for="dialog#menu" popovertarget="menu" lang={lang} />
    </nav>

    <SiteNavDialog lang={lang} />
  </span>
);
