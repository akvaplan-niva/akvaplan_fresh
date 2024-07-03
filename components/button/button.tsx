import { HTMLProps } from "preact";

type Props = HTMLProps<HTMLButtonElement> & {
  additionalClass?: string;
  filled?: boolean;
};

export const Button = ({
  additionalClass = "",
  filled = false,
  children,
  ...props
}: Props) => (
  <button
    class={`custom-button ${additionalClass} ${
      filled ? "custom-button-filled" : ""
    }`}
    {...props}
  >
    {children}
  </button>
);

export const LinkButton = ({ href, text, style, children, props }) => (
  <a href={href}>
    <Button
      style={{
        backgroundColor: "transparent",
        fontSize: ".8rem",
        ...style,
      }}
      href={href}
      {...props}
    >
      {text ?? children}
    </Button>
  </a>
);

export default Button;
