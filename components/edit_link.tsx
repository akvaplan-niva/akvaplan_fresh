import { t } from "akvaplan_fresh/text/mod.ts";
import { Icon } from "akvaplan_fresh/components/icon.tsx";

export const EditLinkIcon = ({ href }) => (
  <a
    href={href}
    style={{ color: "var(--text2)", fontSize: ".75rem" }}
    title={t("ui.edit")}
  >
    <Icon
      name="edit"
      style={{ width: "24px" }}
    />
  </a>
);
