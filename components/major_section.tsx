import { JSX } from "preact/jsx-runtime";

export function MajorSection(
  { id, children }: {
    id?: string;
    children: JSX.Element | JSX.Element[];
  },
) {
  const majorSectionPadding =
    "px-[3vw] lg:px-[4vw] 2xl:px-[9vw] 3xl:px-[18vw] pt-12p lg:pt-24";
  return (
    <section id={id} class={majorSectionPadding}>
      {children}
    </section>
  );
}
