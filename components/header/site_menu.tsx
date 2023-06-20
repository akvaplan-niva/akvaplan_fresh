import { Icon, SiteNavDialog } from "akvaplan_fresh/components/mod.ts";
import ButtonOpenDialog from "akvaplan_fresh/islands/button_open_dialog.tsx";

export const SiteMenu = ({ lang }) => (
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
      <ButtonOpenDialog for="dialog#menu" lang={lang} />
    </nav>
    <SiteNavDialog lang={lang} />
  </span>
);
