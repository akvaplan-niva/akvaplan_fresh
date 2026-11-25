import type { JSX } from "preact";
import IconButton from "@/components/button/icon_button.tsx";

export const handleClick = (
  e: JSX.TargetedMouseEvent<HTMLButtonElement>,
) => {
  const button = e.currentTarget;
  const query = button.dataset.for ?? "dialog";
  const dialog = button.ownerDocument.querySelector(query);
  if (dialog instanceof HTMLDialogElement) {
    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }
};

export default (
  { children, ...props }: JSX.HTMLAttributes<HTMLButtonElement>,
) => (
  <IconButton
    {...props}
    type="button"
    onClick={handleClick}
    icon="search"
    iconHeight="1.5rem"
    iconWidth="1.5rem"
  >
    {children}
  </IconButton>
);
