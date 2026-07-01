type Props = HTMLProps<HTMLButtonElement> & {
  additionalClass?: string;
  filled?: boolean;
};

// with TW:
// <span class="inline-flex items-center gap-3 px-8 py-4 mt-6 text-sm font-semibold border-2 border-white/90 rounded-full bg-white/10 backdrop-blur-md hover:bg-white hover:text-zinc-900 hover:border-white transition-all w-fit group">
//             {published}
//             <span class="text-xl transition-transform group-hover:translate-x-1">
//             </span>
//           </span>
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
