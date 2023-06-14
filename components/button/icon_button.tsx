import { Icon } from "../icon.tsx";

type IconButtonProps = {
  icon: string;
  text?: string;
  reverse?: boolean;
  onClick?: () => void;
  href?: string;
  customStyle?: Record<string, string>;
} & JSX.HTMLAttributes<HTMLButtonElement>;

export default function IconButton({
  icon,
  text,
  reverse = false,
  onClick,
  href,
  customStyle = {},
  ...props
}: IconButtonProps) {
  const innerContent = () => (
    <>
      {icon && <Icon name={icon} width={20} height={20} />}
      {text && (
        <span
          style={{
            margin: icon ? "0 var(--size-1)" : "0",
          }}
        >
          {text}
        </span>
      )}
    </>
  );

  return (
    <button
      className="icon-button"
      style={{
        flexDirection: reverse ? "row-reverse" : "row",
        ...customStyle,
      }}
      onClick={onClick}
      {...props}
    >
      {href ? <a href={href}>{innerContent()}</a> : innerContent()}
    </button>
  );
}
