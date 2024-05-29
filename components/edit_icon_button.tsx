import { Icon } from "akvaplan_fresh/components/icon.tsx";

export const EditIconButton = ({ authorized, href }) =>
  authorized && (
    <a href={href}>
      <Icon name="edit" style={{ minWidth: "24px", width: "1rem" }} />
    </a>
  );
