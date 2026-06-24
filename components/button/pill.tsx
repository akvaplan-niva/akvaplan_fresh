import Button from "./button.tsx";
import { Icon } from "@/components/icon.tsx";
import { PropsWithChildren } from "preact";

export type PillProps = PropsWithChildren & {
  selected: boolean;
};

export function Pill(
  { children, selected, icon = "close", ...props }: PillProps = {},
) {
  return (
    <Button
      additionalClass={`pill ${selected ? "pill-selected" : ""}`}
      {...props}
    >
      {children}
      {selected && (
        <>
          {icon && <span>&nbsp;</span>}
          <Icon name={icon} style={{ width: "1rem", height: "1rem" }} />
        </>
      )}
    </Button>
  );
}
