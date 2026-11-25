import type { JSX } from "preact";
import Button from "./button.tsx";
import { Icon } from "../icon.tsx";

type IconButtonProps = {
  icon: string;
  reverse?: boolean;
  iconHeight?: string;
  iconWidth?: string;
  children: any;
} & JSX.HTMLAttributes<HTMLButtonElement>;

export default function IconButton({
  icon,
  reverse,
  iconHeight,
  iconWidth,
  onClick,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...props}
      onClick={onClick}
      additionalClass={`icon-button ${reverse ? "icon-button-reversed" : ""}`}
    >
      <Icon name={icon} width={iconWidth} height={iconHeight} />
      {children}
    </Button>
  );
}
