const textColor = ({ muted }: { muted: boolean }) =>
  muted ? "var(--muted)" : "var(--accent)";

const eyebrowStyle = ({ color }: { color: string }) =>
  `font-family: var(--font-mono);
  color: ${color};
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 5%;
  text-transform: uppercase;
  display: inline;
  margin-block-end: .5rem;
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
      class={`text-sm gap-6 whitespace-nowrap`}
      style={eyebrowStyle({ color })}
    >
      {text}
    </span>
  );
}
