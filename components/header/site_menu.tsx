import SiteNavDialog from "akvaplan_fresh/components/site_menu_dialog.tsx";
import ButtonOpenDialog from "akvaplan_fresh/islands/button_open_dialog.tsx";

export const SiteSearchDialog = ({ lang }) => (
  <span
    class="header-end"
    style={{
      display: "grid",
      justifyContent: "end",
      marginTop: "0.5rem",
      marginRight: "0.5rem",
    }}
  >
    <nav>
      <ButtonOpenDialog for="dialog#menu" popovertarget="menu" lang={lang} />
    </nav>

    <SiteNavDialog lang={lang} />
  </span>
);
