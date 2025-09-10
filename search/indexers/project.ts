type ProjectLifecycle = "ongoing" | "past" | "future";

export const projectLifecycle = (
  { end }: { end: string | Date },
) => {
  return new Date() > new Date(end)
    ? "past"
    : "ongoing" satisfies ProjectLifecycle;
};
