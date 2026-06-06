import { string } from "@std/http/unstable-structured-fields";

const textColor = ({ muted }: { muted: boolean }) =>
  muted ? "var(--muted)" : "var(--accent)";

const eyebrowStyle = ({ color }: { color: string }) =>
  `font-family: var(--font-mono);
  color: ${color};
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 100%;
  letter-spacing: 5%;
  text-transform: uppercase;
`;
// w-8 gap-3 h-px ?

export function Eyebrow(
  { text = "", href, color, muted = false }: {
    text: string;
    href?: string;
    muted?: boolean;
    color?: string;
  },
) {
  color = color ? color : textColor({ muted });
  return (
    <a style={eyebrowStyle({ color })} href={href}>
      {text}
    </a>
  );
}
