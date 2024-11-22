import Button from "akvaplan_fresh/components/button/button.tsx";
import { Icon } from "akvaplan_fresh/components/icon.tsx";
import { Signal } from "@preact/signals-core";
import { JSX } from "preact/jsx-runtime";
import { t } from "akvaplan_fresh/text/mod.ts";

export const SearchViewButtons = (
  {
    display,
    toggleListDisplay,
    increaseLimit,
    decreaseLimit,
    limit,
    min,
    max,
  }: {
    toggleListDisplay: JSX.TargetedEvent<HTMLButtonElement, Event>;
    increaseLimit: JSX.TargetedEvent<HTMLButtonElement, Event>;
    decreaseLimit: JSX.TargetedEvent<HTMLButtonElement, Event>;
    display: Signal<string>;
    limit: number | Signal<number>;
    min: number | Signal<number>;
    max: number | Signal<number>;
  },
) => (
  <>
    <label class="hide-s">
      <Button
        style={{
          margin: "0.125rem",
          padding: "0.125rem",
          fontSize: "1.5rem",
          borderRadius: "0.125rem",
          border: 0,
        }}
        onClick={toggleListDisplay}
        title={display.value === "grid"
          ? t("search.view_as_list")
          : t("search.view_compact")}
      >
        <Icon
          name={display.value === "grid" ? "view_stream" : "view_compact_alt"}
        />
      </Button>
    </label>
    <label>
      <Button
        disabled={Number(limit) >= max}
        style={{
          margin: "0.125rem",
          padding: "0.125rem",
          fontSize: "1.5rem",
          borderRadius: "0.125rem",
          border: 0,
        }}
        onClick={increaseLimit}
        title={t("search.show_more")}
      >
        <Icon name="add" />
      </Button>
    </label>
    <label>
      <Button
        disabled={Number(limit) < min}
        style={{
          margin: "0.125rem",
          padding: "0.125rem",
          fontSize: "1.5rem",
          borderRadius: "0.125rem",
          border: 0,
        }}
        onClick={decreaseLimit}
        title={t("search.show_less")}
      >
        <Icon name="remove" />
      </Button>
    </label>
  </>
);
