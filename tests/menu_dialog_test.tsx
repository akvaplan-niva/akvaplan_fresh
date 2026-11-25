import { assertEquals } from "@std/assert";
import { handleClick } from "../islands/button_open_dialog.tsx";
import type { JSX } from "preact";

Deno.test("nested icon clicks use the button target and toggle the dialog", () => {
  class Dialog {
    open = false;
    showModal() {
      this.open = true;
    }
    close() {
      this.open = false;
    }
  }
  Object.defineProperty(globalThis, "HTMLDialogElement", {
    configurable: true,
    value: Dialog,
  });
  const dialog = new Dialog();
  const event = {
    target: { tagName: "path" },
    currentTarget: {
      dataset: { for: "dialog#menu" },
      ownerDocument: {
        querySelector(query: string) {
          assertEquals(query, "dialog#menu");
          return dialog;
        },
      },
    },
  } as unknown as JSX.TargetedMouseEvent<HTMLButtonElement>;
  try {
    handleClick(event);
    assertEquals(dialog.open, true);
    handleClick(event);
    assertEquals(dialog.open, false);
    handleClick(event);
    assertEquals(dialog.open, true);
  } finally {
    Reflect.deleteProperty(globalThis, "HTMLDialogElement");
  }
});
