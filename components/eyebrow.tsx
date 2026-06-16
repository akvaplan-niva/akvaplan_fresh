const textColor = ({ muted }: { muted: boolean }) =>
  muted ? "var(--muted)" : "var(--accent)";

const eyebrowStyle = ({ color }: { color: string }) =>
  `font-family: var(--font-mono);
  color: ${color};
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 5%;
  text-transform: uppercase;
`;

export function Eyebrow(
  { text = "", color, muted = false }: {
    text: string;
    href?: string;
    muted?: boolean;
    color?: string;
  },
) {
  color = color ? color : textColor({ muted });
  return (
    <span
      class={`text-sm gap-3 w-8`}
      style={eyebrowStyle({ color })}
    >
      {text}
    </span>
  );
}
