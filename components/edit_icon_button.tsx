import { Icon } from "akvaplan_fresh/components/icon.tsx";

export const EditIconButton = ({ authorized, href }) =>
  authorized === true
    ? (
      <a href={href}>
        <Icon name="edit" style={{ minWidth: "24px", width: "1rem" }} />
      </a>
    )
    : <a />;
