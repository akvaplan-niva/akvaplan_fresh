import { ComponentChildren } from "preact";
//line-clamp-3
export const Intro = (
  { children, ...props }: { children: ComponentChildren },
) => (
  <div
    style={{
      fontSize: "var(--size-fluid-3)",
      textWrap: "balance",
      lineHeight: 1.25,
    }}
    {
      //class={`text-6xl _text-[clamp(1.25rem,1.25vw,2rem)] _2xl:max-w-[67%] text-balance`}
      ...props
    }
  >
    {children}
  </div>
);
