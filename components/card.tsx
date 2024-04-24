import { JSX } from "preact";
type CardProps = JSX.HTMLAttributes<HTMLDivElement>;

interface Props {
  img?: string;
  customClass?: string;
}

export function Card({
  img,
  customClass,
  children,
}: Props) {
  const fullClass = `card ${customClass ?? ""}`;
  return (
    <div
      class={fullClass}
      style={{
        background: "var(--surface2)",
        padding: "var(--size-2)",
        borderRadius: "var(--radius-2)",
        boxShadow: "var(--shadow-4)",
        //margin: "0.25rem",
      }}
    >
      {img ? <img src={img} alt="" /> : null}
      {children}
    </div>
  );
}

export const MiniCard = (props: HTMLElement) => (
  <div
    style={{
      ...props.style,
      // background: "var(--surface2)",
      // borderRadius: "var(--radius-2)",
      // boxShadow: "var(--shadow-4)",
    }}
  >
    {props.children}
  </div>
);
