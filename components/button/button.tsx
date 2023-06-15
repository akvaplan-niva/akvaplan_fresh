import { HTMLProps } from "preact";

type Props = HTMLProps<HTMLButtonElement>;

export function Button({ children, ...props }: Props) {
  return (
    <button class="custom-button" {...props}>
      {children}
    </button>
  );
}
