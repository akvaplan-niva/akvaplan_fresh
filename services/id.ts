export const extractNumericId = (id: string | number) =>
  Number(String(id).split("/").at(-1));
