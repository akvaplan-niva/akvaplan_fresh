import { t } from "akvaplan_fresh/text/mod.ts";
import { Icon } from "akvaplan_fresh/components/mod.ts";
import Button from "../button/button.tsx";
import { asset, Head } from "$fresh/runtime.ts";

type HScrollProps = HTMLElement & {
  scrollerId?: string;
  staticFirstElement?: HTMLElement;
  maxVisibleChildren?: number;
};

type HScrollButtonProps = {
  extraClass: string;
  dataFor: string;
  value: string;
  ariaLabel: string;
};

//unicode: ˂˃

function HScrollButton(
  { extraClass, dataFor, value, ariaLabel }: HScrollButtonProps,
) {
  return (
    <Button
      class={`scroller-button scroller-button--${extraClass}`}
      data-for={dataFor}
      value={value}
      aria-label={ariaLabel}
    >
      {value === "left"
        ? <Icon name="arrow_back_ios_new" width="1rem" height="1rem" />
        : <Icon name="arrow_forward_ios" width="1rem" height="1rem" />}
    </Button>
  );
}

export function HScroll({
  children,
  scrollerId = `hscroll-${crypto.randomUUID()}`,
  staticFirstElement,
  maxVisibleChildren,
  ...props
}: HScrollProps) {
  const maxVisibleChildrenClass = maxVisibleChildren
    ? "max-visible-children"
    : "";

  return (
    <div class="scroll-container" {...props}>
      {
        /* <HScrollButton
        extraClass={"left"}
        dataFor={scrollerId}
        value={"left"}
        ariaLabel={t("ui.scroll_left")}
      />
      <HScrollButton
        extraClass={"right"}
        dataFor={scrollerId}
        value={"right"}
        ariaLabel={t("ui.scroll_right")}
      /> */
      }

      {staticFirstElement && staticFirstElement}
      <core-scroll
        id={scrollerId}
        class={`hscroll ${maxVisibleChildrenClass}`}
        style={maxVisibleChildren
          ? {
            "--max-visible-children": maxVisibleChildren,
          }
          : {}}
      >
        {children}
      </core-scroll>
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
      </Head>
    </div>
  );
}

export default HScroll;
