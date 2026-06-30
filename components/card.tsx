import { ComponentChildren } from "preact";

interface CardProps {
  img?: string;
  customClass?: string;
  children: ComponentChildren;
  style?: Record<string, string>;
}

export function Card({
  img,
  customClass,
  style = {},
  children,
}: CardProps) {
  const fullClass = `card ${customClass ?? ""}`;
  return (
    <div
      class={fullClass}
      style={{
        background: "var(--surface2)",
        padding: "var(--size-2)",
        borderRadius: "var(--radius-2)",
        boxShadow: "var(--shadow-4)",
        margin: ".5vw",
        ...style,
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

{
  // HorizontalCard
  /* <Card>
  <div style="display: grid; gap: 0.75rem; padding: .5rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)">
    <div style="place-content: center;">
      <h1>
        <p>{title}</p>
      </h1>
      <p style="font-size: 1rem;">
      </p>
    </div>
    <span style="place-content: center;">
      <WideImage {...service.image} />
    </span>
  </div>
</Card>; */
}
